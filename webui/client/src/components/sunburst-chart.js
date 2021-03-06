import React from 'react'
import { Sunburst, LabelSeries } from 'react-vis'
import { forEach, get, includes, uniq, without } from 'lodash'
import { fadeColor } from '../lib/utils'

const LABEL_STYLE = {
  PERCENTAGE: {
    fontSize: '1.3em',
    textAnchor: 'middle'
  },
  FRACTION: {
    fontSize: '1.2em,',
    textAnchor: 'middle'
  },
  PATH: {
    fontSize: '1em',
    textAnchor: 'middle'
  },
  DESCRIPTION: {
    fontSize: '0.9em',
    textAnchor: 'middle'
  }
}

export default function SunburstChart (props) {

  const {
    chartLocked,
    endpoints,
    focusChart,
    focusPath,
    interiorLabel,
    lockChart,
    setEndpointTests,
    sunburst,
    unfocusChart,
    unlockChart
  } = props

  if (sunburst == null) return null
  return(
      <div className="sunburst-wrapper">
      <Sunburst
    hideRootNode
    colorType="literal"
    data={sunburst.data}
    height={500}
    width={500}
    getColor={node => determineColor(node)}
    onValueMouseOver={handleMouseOver}
    onValueMouseOut={handleMouseOut}
    onValueClick={handleClick}
      >
      {(interiorLabel && interiorLabel.percentage) &&
       <LabelSeries
       data={[
         {x: 0, y: 60, label: interiorLabel.percentage, style: LABEL_STYLE.PERCENTAGE},
         {x: 0, y: 0, label: interiorLabel.ratio, style: LABEL_STYLE.FRACTION},
         {x: 0, y: -20, label: 'total tested', style: LABEL_STYLE.PATH}
       ]}
       />}
    {(interiorLabel && interiorLabel.description) &&
     <LabelSeries
     data={[
       {x: 0, y: 0, label: interiorLabel.description, style: LABEL_STYLE.DESCRIPTION}
     ]}
     />}
    </Sunburst>
      </div>
  )

  function determineColor (node) {
    if (focusPath.length > 0 && !node.checked) {
      if (!node.color) {
       // return node.color = node.color
       node.checked = true
       return node.color = 'rgba(255,255,255,0.1)'
      } else if (node.parent && includes(focusPath, node.name) && includes(focusPath, node.parent.data.name)) {
        node.checked = true
        var brightColor = fadeColor(node.color, '1')
        return node.color = brightColor
       // return node.color = 'rgba(255,218,185,1)'
      } else {
        var fadedColor = fadeColor(node.color, '0.1')
        node.checked = true
//         return node.color = 'rgba(255,218,185,1)'
        return node.color = fadedColor

        }
      }
    node.checked = false
    return node.color
    }

  function handleMouseOver (node, event) {
    if (!chartLocked) {
      focusChart(getKeyPath(node))
    }
  }

  function handleMouseOut () {
    if (!chartLocked) {
      unfocusChart()
    }
  }

  function handleClick () {
    if (chartLocked){
      unlockChart()
    } else if (!chartLocked && focusPath.length > 3) {
       var endpointTests = getEndpointTests(focusPath)
       setEndpointTests(endpointTests)
      lockChart()
    } else {
      lockChart()
    }
  }

  function getKeyPath (node) {
    if (!node.parent) {
      return ['root'];
    }
    var nodeKey = get(node, 'data.name') || get(node, 'name')
    var parentKeyPath = getKeyPath(node.parent)
    return [...parentKeyPath, nodeKey]
  }

  function getEndpointTests (focusPath) {
    var endpointTests = []
    var pathSansRoot = without(focusPath, 'root')
    var lockedEndpoint = get(endpoints, pathSansRoot)
    forEach(lockedEndpoint, (method) => {
      for (var test of method.tests) {
        endpointTests.push(test)
      }
    })
    return uniq(endpointTests)
  }
}
