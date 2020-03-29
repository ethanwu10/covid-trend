import React, { lazy } from 'react'
import Center from './components/Center'
import Spinner from './components/Spinner'
import useSWR from 'swr'

const Plot = lazy(() => import('react-plotly.js'))

export default function DataPlot({ states, avgSz }) {
  const { data: allStatesData, error } = useSWR("https://covidtracking.com/api/states/daily")
  if (error) {
    return <Center width='100%' height='100%'>Oh noes! An error occurred!</Center>
  }
  if (!allStatesData) {
    return (
      <Spinner />
    )
  }

  function getStateData(state) {
    return allStatesData.filter(d => d.state === state)
  }

  function genTrace(state) {
    const data = getStateData(state)
    let pi = data.map(d => d.positiveIncrease)
    for (let i = 0; i < pi.length - avgSz; i++) {
      pi[i] = pi.slice(i, i + avgSz).reduce((a, b) => a + b, 0) / avgSz
    }
    pi = pi.slice(0, -avgSz)
    return {
      x: data.map(d => d.positive).slice(0, -avgSz),
      y: pi,
      mode: "lines",
      type: "scatter",
      name: state
    }
  }

  return (
    <Plot
      data={states.map(s => genTrace(s))}
      layout={{
        title: {
          text: "COVID-19 Trend in USA",
          font: {
            family: "Nunito, sans-serif",
            weight: "bold",
            size: 24
          }
        },
        xaxis: {
          type: "log",
          autorange: true,
          title: {
            text: "cumulative positive cases",
            font: {
              family: "Nunito, sans-serif",
              size: 18
            }
          }
        },
        yaxis: {
          type: "log",
          autorange: true,
          title: {
            text: "daily positive cases",
            font: {
              family: "Nunito, sans-serif",
              size: 18
            }
          }
        },
        autosize: true
      }}
      useResizeHandler={true}
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  )
}
