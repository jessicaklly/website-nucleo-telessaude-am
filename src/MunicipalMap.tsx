import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { amazonasMap } from './data/amazonasMap'
import type { MapMunicipality } from './data/amazonasMap'
import { servicosTele } from './data/servicos'

/** Observação opcional exibida no painel ao selecionar um município. */
const notes: Record<string, string> = {
  Manaus: 'Sede do Núcleo, na FUnATI.',
}

const { width: MAP_W, height: MAP_H, municipalities } = amazonasMap
const FULL: View = [0, 0, MAP_W, MAP_H]
const ASPECT = MAP_W / MAP_H

type View = [number, number, number, number]
type Status = 'atendido' | 'nao'
type Filter = Status | null

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
  const [filter, setFilter] = useState<Filter>(null)
  const [view, setView] = useState<View>(FULL)
  const viewRef = useRef<View>(FULL)
  const targetRef = useRef<View>(FULL)
  const frameRef = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)

  const byId = useMemo(() => new Map(municipalities.map((m) => [m.id, m])), [])
  const selected = selectedId ? byId.get(selectedId) : undefined

  // Municípios atendidos pelo Telediagnóstico.
  const served = useMemo(() => new Set(servicosTele.flatMap((item) => item.atendidos)), [])

  const statusOf = (name: string): Status => (served.has(name) ? 'atendido' : 'nao')
  const statusText: Record<Status, string> = {
    atendido: 'Ativo',
    nao: 'Não ativo',
  }
  const count = (status: Status) => municipalities.filter((m) => statusOf(m.name) === status).length
  const legend: Status[] = ['atendido']
  const servedList = useMemo(() => municipalities.filter((m) => served.has(m.name)), [served])
  const choiceLabel = 'Telediagnóstico'

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

  const hovered = hover ? byId.get(hover.id) : undefined
  const zoomed = view[2] < MAP_W - 1
  // Espessura de traço constante na tela, qualquer que seja o zoom.
  const stroke = (view[2] / MAP_W) * 0.9

  return (
    <div className="muni-wrap">
      <div className="muni-map">
        <div className="muni-stage" ref={stageRef}>
          <svg
            className="muni-svg"
            viewBox={view.join(' ')}
            role="group"
            aria-label={`Mapa dos municípios do Amazonas atendidos pelo Telediagnóstico`}
            onPointerLeave={() => setHover(null)}
          >
            <g strokeWidth={stroke}>
              {municipalities.map((m) => {
                const isServed = served.has(m.name)
                const isSelected = m.id === selectedId
                const status = statusOf(m.name)
                const dim = filter !== null && filter !== status
                return (
                  <path
                    key={m.id}
                    d={m.d}
                    className={`muni-shape s-${status}${isServed ? ' s-ativo' : ''}${dim ? ' is-dim' : ''}${
                      isSelected ? ' is-selected' : ''
                    }`}
                    role="img"
                    aria-label={`${m.name}: ${statusText[status]}`}
                    onPointerMove={(event) => onMove(event, m.id)}
                    onClick={() => select(isSelected ? null : m)}
                  />
                )
              })}
            </g>

            {/* Marcadores pulsantes nos municípios atendidos. */}
            <g className="muni-pins" pointerEvents="none">
              {servedList
                .filter(() => filter === null || filter === 'atendido')
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
              <span>{statusText[statusOf(hovered.name)]}</span>
              <ul className="muni-tip-services">
                {servicosTele.map((item) => (
                  <li key={item.id} className={item.atendidos.includes(hovered.name) ? 'is-on' : ''}>
                    <span>{item.label}</span>
                    <b>{item.atendidos.includes(hovered.name) ? 'Ativo' : '—'}</b>
                  </li>
                ))}
              </ul>
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
            <ul className="muni-services">
              {servicosTele.map((item) => (
                <li key={item.id}>
                  <span className="muni-svc-name">{item.label}</span>
                  <b className="muni-svc-big">{item.resumo[0]!.valor}</b>
                  <span className="muni-svc-sub">
                    {item.resumo[0]!.rotulo}
                    {item.resumo.slice(1).map((r) => ` · ${r.valor} ${r.rotulo}`).join('')}
                  </span>
                </li>
              ))}
            </ul>
            <ul className="muni-status-list">
              {legend.map((status) => (
                <li key={status}>
                  <button
                    type="button"
                    className={filter === status ? 'is-active' : ''}
                    aria-pressed={filter === status}
                    onClick={() => setFilter(filter === status ? null : status)}
                  >
                    <span className={`legend-dot s-${status}`} />
                    <span className="muni-status-name">{statusText[status]}</span>
                    <strong>{count(status)}</strong>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selected ? (
            <div className="muni-detail">
              <span className={`muni-status${served.has(selected.name) ? ' s-ativo' : ''}`}>
                {statusText[statusOf(selected.name)]}
              </span>
              <h3>{selected.name}</h3>
              <p>
                {served.has(selected.name)
                  ? `Serviços ativos: ${servicosTele.filter((item) => item.atendidos.includes(selected.name)).map((item) => item.label).join(', ')}.`
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
            <p className="muni-hint">Passe o mouse ou clique em um município do mapa.</p>
          )}
        </aside>
      </div>
    </div>
  )
}

export default MunicipalMap
