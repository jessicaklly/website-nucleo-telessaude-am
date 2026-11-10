import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { amazonasMap } from './data/amazonasMap'
import type { MapMunicipality } from './data/amazonasMap'
import { telediagnostico } from './data/servicos'

/** Observação opcional exibida no painel ao selecionar um município. */
const notes: Record<string, string> = {
  Manaus: 'Sede do Núcleo, na FUnATI.',
}

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

const { width: MAP_W, height: MAP_H, municipalities } = amazonasMap
const FULL: View = [0, 0, MAP_W, MAP_H]
const ASPECT = MAP_W / MAP_H

type View = [number, number, number, number]
type Filter = 'atendido' | 'nao' | null

/** Enquadramento (viewBox) que mostra a caixa informada, com folga. */
const frame = (box: [number, number, number, number], scale = 2.4): View => {
  const [bx, by, bw, bh] = box
  let w = Math.max(bw * scale, 150)
  let h = w / ASPECT
  if (h < bh * scale) {
    h = bh * scale
    w = h * ASPECT
  }
  return [bx + bw / 2 - w / 2, by + bh / 2 - h / 2, w, h]
}

function MunicipalMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>(null)
  const [view, setView] = useState<View>(FULL)
  const viewRef = useRef<View>(FULL)
  const targetRef = useRef<View>(FULL)
  const frameRef = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)

  const byId = useMemo(() => new Map(municipalities.map((m) => [m.id, m])), [])
  const selected = selectedId ? byId.get(selectedId) : undefined

  // Municípios atendidos pelo Telediagnóstico.
  const served = useMemo(() => new Set(telediagnostico.atendidos), [])

  const servedList = useMemo(() => municipalities.filter((m) => served.has(m.name)), [served])
  const choiceLabel = telediagnostico.label

  // Anima o enquadramento até o alvo (zoom e deslocamento suaves).
  const animate = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    const step = () => {
      const from = viewRef.current
      const to = targetRef.current
      const next = from.map((value, index) => value + (to[index]! - value) * 0.18) as View
      const done = next.every((value, index) => Math.abs(value - to[index]!) < 0.2)
      viewRef.current = done ? to : next
      setView(viewRef.current)
      if (!done) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const goTo = useCallback(
    (target: View) => {
      targetRef.current = target
      animate()
    },
    [animate],
  )

  const select = useCallback(
    (municipality: MapMunicipality | null) => {
      setSelectedId(municipality ? municipality.id : null)
      goTo(municipality ? frame(municipality.bbox) : FULL)
    },
    [goTo],
  )

  const zoom = (factor: number) => {
    const [x, y, w, h] = targetRef.current
    const nw = Math.min(Math.max(w * factor, 90), MAP_W)
    const nh = nw / ASPECT
    goTo([x + w / 2 - nw / 2, y + h / 2 - nh / 2, nw, nh])
  }

  const onMove = (event: ReactPointerEvent<SVGPathElement>, id: string) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    setHover({ id, x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  const results = useMemo(() => {
    const term = normalize(query.trim())
    if (!term) return []
    return municipalities.filter((m) => normalize(m.name).includes(term)).slice(0, 6)
  }, [query])

  const hovered = hover ? byId.get(hover.id) : undefined
  const zoomed = view[2] < MAP_W - 1
  // Espessura de traço constante na tela, qualquer que seja o zoom.
  const stroke = (view[2] / MAP_W) * 0.9
  const total = municipalities.length

  return (
    <div className="muni-wrap">
      <div className="muni-map">
        <div className="muni-stage" ref={stageRef}>
          <svg
            className="muni-svg"
            viewBox={view.join(' ')}
            role="group"
            aria-label={`Mapa dos municípios do Amazonas atendidos pelo ${choiceLabel}`}
            onPointerLeave={() => setHover(null)}
          >
            <g strokeWidth={stroke}>
              {municipalities.map((m) => {
                const isServed = served.has(m.name)
                const isSelected = m.id === selectedId
                const dim = filter !== null && (filter === 'atendido') !== isServed
                return (
                  <path
                    key={m.id}
                    d={m.d}
                    className={`muni-shape${isServed ? ' s-ativo' : ''}${dim ? ' is-dim' : ''}${
                      isSelected ? ' is-selected' : ''
                    }`}
                    role="img"
                    aria-label={`${m.name}${isServed ? ': atendido' : ': ainda não atendido'}`}
                    onPointerMove={(event) => onMove(event, m.id)}
                    onClick={() => select(isSelected ? null : m)}
                  />
                )
              })}
            </g>

            {/* Marcadores pulsantes nos municípios atendidos. */}
            <g className="muni-pins" pointerEvents="none">
              {servedList
                .filter(() => filter !== 'nao')
                .map((m) => (
                  <g key={m.id} transform={`translate(${m.x} ${m.y})`}>
                    <circle className="muni-pulse" r={(view[2] / MAP_W) * 9} />
                    <circle className="muni-dot" r={(view[2] / MAP_W) * 3.4} />
                  </g>
                ))}
            </g>
          </svg>

          {hovered && hover && (
            <div className="muni-tip" style={{ left: hover.x, top: hover.y }}>
              <strong>{hovered.name}</strong>
              <span>{served.has(hovered.name) ? 'Atendido' : 'Ainda não atendido'}</span>
            </div>
          )}

          {servedList.length === 0 && (
            <div className="muni-soon">
              <strong>Em breve</strong>
              <span>Os municípios atendidos pelo {choiceLabel} serão exibidos aqui.</span>
            </div>
          )}

          <div className="muni-controls" role="group" aria-label="Zoom do mapa">
            <button type="button" onClick={() => zoom(0.6)} aria-label="Aproximar">
              +
            </button>
            <button type="button" onClick={() => zoom(1 / 0.6)} aria-label="Afastar">
              −
            </button>
            <button
              type="button"
              onClick={() => select(null)}
              aria-label="Ver o estado inteiro"
              disabled={!zoomed && !selected}
            >
              ⤢
            </button>
          </div>
        </div>

        <aside className="muni-panel">
          <div>
            <h3>{choiceLabel}</h3>
            <ul className="muni-status-list">
              <li>
                <button
                  type="button"
                  className={filter === 'atendido' ? 'is-active' : ''}
                  aria-pressed={filter === 'atendido'}
                  onClick={() => setFilter(filter === 'atendido' ? null : 'atendido')}
                >
                  <span className="legend-dot s-ativo" />
                  <span className="muni-status-name">Municípios atendidos</span>
                  <strong>{servedList.length}</strong>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={filter === 'nao' ? 'is-active' : ''}
                  aria-pressed={filter === 'nao'}
                  onClick={() => setFilter(filter === 'nao' ? null : 'nao')}
                >
                  <span className="legend-dot" />
                  <span className="muni-status-name">Ainda não atendidos</span>
                  <strong>{total - servedList.length}</strong>
                </button>
              </li>
            </ul>
          </div>

          <label className="muni-search">
            <span className="sr-only">Buscar município</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5" />
            </svg>
            <input
              type="search"
              placeholder="Buscar município..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
          </label>

          {query.trim() ? (
            <ul className="muni-list" aria-label="Resultados da busca">
              {results.length === 0 && <li className="muni-empty">Nenhum município encontrado.</li>}
              {results.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className={m.id === selectedId ? 'is-active' : ''}
                    onClick={() => {
                      select(m)
                      setQuery('')
                    }}
                  >
                    <span>{m.name}</span>
                    <small>{served.has(m.name) ? 'Atendido' : 'Não atendido'}</small>
                  </button>
                </li>
              ))}
            </ul>
          ) : selected ? (
            <div className="muni-detail">
              <span className={`muni-status${served.has(selected.name) ? ' s-ativo' : ''}`}>
                {served.has(selected.name) ? 'Atendido' : 'Ainda não atendido'}
              </span>
              <h3>{selected.name}</h3>
              <p>
                {served.has(selected.name)
                  ? 'Município com serviço de telediagnóstico do Núcleo.'
                  : 'O telediagnóstico do Núcleo ainda não chega a este município.'}
              </p>
              {notes[selected.name] && <p>{notes[selected.name]}</p>}
              {!served.has(selected.name) && (
                <a className="muni-link" href="#/contato">
                  Quero levar o telediagnóstico para cá <span aria-hidden="true">→</span>
                </a>
              )}
              <button type="button" className="muni-back" onClick={() => select(null)}>
                ← Ver todo o estado
              </button>
            </div>
          ) : (
            <div className="muni-list-wrap">
              <h3>Municípios atendidos</h3>
              {servedList.length === 0 ? (
                <p className="muni-empty">Em breve.</p>
              ) : (
                <ul className="muni-list">
                  {servedList.map((m) => (
                    <li key={m.id}>
                      <button type="button" onClick={() => select(m)}>
                        <span>{m.name}</span>
                        <small>Ver no mapa</small>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="muni-hint">Clique em um município do mapa ou use a busca.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default MunicipalMap
