import React, { useState, useCallback, useMemo } from 'react';
import { Box, Card, Link } from 'rebass'
import { Label as RebassLabel, Input, Checkbox } from '@rebass/forms'

import _ from 'lodash'
import Fuse from 'fuse.js'

import TrendGraph from './TrendGraph'

import states from './states'

// Modify label to make sure hidden inputs with position=absolute are positioned correctly
const Label = ({ sx, ...props }) => <RebassLabel {...props} sx={{position: 'relative', ...sx}} />

const entries = {
  'TOTAL': 'US Total',
  ...states
}

const statesFuse = new Fuse(Object.keys(entries).map(k => ({ short: k, long: entries[k] })), {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: ['long']
})

function App() {
  const [selected, setSelected] = useState(_.mapValues(entries, () => false));
  const [avgSz, _setAvgSz] = useState(4);
  const setAvgSz = useCallback((sz) => _setAvgSz(Math.max(1, sz)), [])
  const setSelectedK = useCallback((v, k) => setSelected(s => {
    const o = {...s}
    o[k] = v
    return o
  }), []);

  const [filter, setFilter] = useState('')
  const shownStates = useMemo(() => {
    if (filter === '') return Object.keys(entries)
    return statesFuse.search(filter).map(r => r.item.short)
  }, [filter])

  return (
    <Box p={2} sx={{
      height: ['auto', '100%'],
      fontFamily: 'body',
      display: 'grid',
      grid: [
        '"chart" 70vh "controls" 70vh "footer"',
        '"chart controls" minmax(0, 1fr) "footer footer" auto / minmax(0, 1fr) 20rem'
      ],
      gridGap: [2, 2, 3]
    }}>
      <Box sx={{gridArea: 'chart'}}>
        <TrendGraph entries={Object.keys(selected).filter((k) => selected[k])} avgSz={avgSz} />
      </Box>
      <Card as='form' p={3} sx={{
        gridArea: 'controls',
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr) auto',
        gridGap: 2
      }}>
        <Box>
          <Label>Search</Label>
          <Input value={filter} onChange={(e) => setFilter(e.target.value)} />
        </Box>
        <Box sx={{
          overflowY: 'auto'
        }}>
          {shownStates.map(s => (
            <Label key={s}>
              <Checkbox
                checked={selected[s]}
                onChange={e => setSelectedK(e.target.checked, s)}
              />
              {entries[s]}
            </Label>
          ))}
        </Box>
        <Box>
          <Label>Rolling average size:</Label>
          <Input
            type='number'
            value={avgSz}
            onChange={e => setAvgSz(Number.parseInt(e.target.value))}
          />
        </Box>
      </Card>
      <Box px={3} sx={{gridArea: 'footer'}}>
        Created by <Link href='https://ethanwu.dev/'>Ethan Wu</Link>, based on <Link href='https://aatishb.com/covidtrends'>a project</Link> by <Link href='https://aatishb.com'>Aatish Bhatia</Link>. Data from <Link href='https://covidtracking.com'>covidtracking.com</Link>. Source <Link href='https://github.com/ethanwu10/covid-trend'>on GitHub</Link>.
      </Box>
    </Box>
  );}

export default App;
