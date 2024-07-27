import React from 'react'
import { PropagateLoader } from 'react-spinners'

const override = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '280px',
    margin: '0 auto'
}

const Spinner = ({ loading }) => {
  return (
    <PropagateLoader 
        color='rgb(226 232 240)'
        loading={ loading }
        cssOverride={override}
        size={25}
    />
  )
}

export default Spinner;