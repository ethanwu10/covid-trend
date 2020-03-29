import React from 'react'
import { Flex } from 'rebass'

function Center({ sx, ...props }) {
  return (
    <Flex
      {...props}
      sx={{
        ...sx,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    />
  )
}

export default Center
