import React from 'react'
import Center from './Center'
import Loader from 'react-spinners/CircleLoader'

function Spinner(props) {
  const forwardedProps = {
    height: '100%',
    width: '100%',
    size: '25vh',
    ...props
  }
  const { size, ...centerProps } = forwardedProps
  return (
    <Center {...centerProps}>
      <Loader size={size} />
    </Center>
  )
}

export default Spinner
