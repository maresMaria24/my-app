import React from 'react'

import PropTypes from 'prop-types'

import './card.css'

const Card = (props) => {
  return (
    <div className={`card-card ${props.rootClassName} `}>
      <div className="card-info">
        <span className="card-text">{props.text}</span>
        <span className="card-text1">{props.text1}</span>
      </div>
    </div>
  )
}

Card.defaultProps = {
  text1: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do.',
  rootClassName: '',
  text: 'Business',
}

Card.propTypes = {
  text1: PropTypes.string,
  rootClassName: PropTypes.string,
  text: PropTypes.string,
}

export default Card
