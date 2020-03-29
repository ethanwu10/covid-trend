import React, { useState, useCallback, useMemo } from 'react';
import { Flex, Box, Card, Link } from 'rebass'
import { Label, Input, Checkbox } from '@rebass/forms'

import _ from 'lodash'
import Fuse from 'fuse.js'

import TrendGraph from './TrendGraph'

import states from './states'

const statesFuse = new Fuse(Object.keys(states).map(k => ({ short: k, long: states[k] })), {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: ['long']
})

function App() {
  const [selected, setSelected] = useState(_.mapValues(states, () => false));
  const [avgSz, _setAvgSz] = useState(4);
  const setAvgSz = useCallback((sz) => _setAvgSz(Math.max(1, sz)), [])
  const setSelectedK = useCallback((v, k) => setSelected(s => {
    const o = {...s}
    o[k] = v
    return o
  }), []);

  const [filter, setFilter] = useState('')
  const shownStates = useMemo(() => {
    if (filter === '') return Object.keys(states)
    return statesFuse.search(filter).map(r => r.item.short)
  }, [filter])
  console.log(selected)

  return (
    <Flex height='100%' p={2} sx={{
      flexDirection: 'column',
      fontFamily: 'body'
    }}>
      <Flex sx={{
        minHeight: 0,
        flex: '0 1 100%',
        flexDirection: ['column', 'row']
      }}>
        <Box width={[1, 2/3]}>
          <TrendGraph states={Object.keys(selected).filter((k) => selected[k])} avgSz={avgSz} />
        </Box>
        <Card as='form' width={[1, 1/3]} height={['60vh', '100%']} p={3}>
          <Flex sx={{
            height: '100%',
            flexDirection: 'column'
          }}>
            <Box mb={2}>
              <Label>Search</Label>
              <Input value={filter} onChange={(e) => setFilter(e.target.value)} />
            </Box>
            <Box sx={{
              flexGrow: 1,
              overflowY: 'auto'
            }}>
              {shownStates.map(s => (
                <Label key={s}>
                  <Checkbox
                    checked={selected[s]}
                    onChange={e => setSelectedK(e.target.checked, s)}
                  />
                  {states[s]}
                </Label>
              ))}
            </Box>
            <Box mt={2}>
              <Label>Rolling average size:</Label>
              <Input
                type='number'
                value={avgSz}
                onChange={e => setAvgSz(Number.parseInt(e.target.value))}
              />
            </Box>
          </Flex>
        </Card>
      </Flex>
      <Box sx={{
        flex: '0 0 auto',
        fontSize: 1
      }} px={3} pt={2}>
        Created by <Link href='https://ethanwu.dev/'>Ethan Wu</Link>, based on <Link href='https://aatishb.com'>a project</Link> by <Link href='https://aatishb.com'>Aatish Bhatia</Link>. Data from <Link href='https://covidtracking.com'>covidtracking.com</Link>. Source <Link href='https://github.com/ethanwu10/covid-trend'>on GitHub</Link>.
      </Box>
    </Flex>
  );}

export default App;
