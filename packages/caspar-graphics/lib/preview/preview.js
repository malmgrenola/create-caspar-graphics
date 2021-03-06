import React from 'react'
import { Link } from 'react-router-dom'
import Caspar from '../caspar'
import Screen from './screen'
import { States } from '../constants'
import Editor from './editor'
import Button from './button'
import Controls from './controls'
import { getQueryData } from '../utils/parse'

const readSettings = (key, defaultValue) => {
  const value = window.localStorage.getItem(key)
  return value ? JSON.parse(value) : defaultValue
}

export default class Preview extends React.Component {
  state = {
    autoPreview: readSettings('autoPreview', true),
    background: readSettings('background', '#ffffff'),
    data: {
      ...(this.props.currentTemplate.component.previewData || {}),
      ...(getQueryData() || {})
    },
    state: null,
    screenSize: null,
    cg: null
  }

  onDataChange = data => {
    this.setState({ data })
  }

  onStateChange = state => {
    this.setState({ state })
  }

  onChangeSetting = key => value => {
    this.setState({ [key]: value })
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  onScreenSizeChange = screenSize => {
    // this.setState({ screenSize })
  }

  onCasparRef = ref => {
    this.setState({ cg: ref })
  }

  render() {
    const { templates, currentTemplate, mode } = this.props
    const { autoPreview, state, screenSize, background } = this.state

    return (
      <div
        style={{
          background: 'white',
          height: '100%',
          boxSizing: 'border-box',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          padding: 20,
          overflow: 'hidden',
          width: '100%'
        }}
      >
        <Screen
          background={background}
          onSizeChange={this.onScreenSizeChange}
          height={this.props.height}
          width={this.props.width}
        >
          <Caspar
            key={currentTemplate.name}
            name={currentTemplate.name}
            ref={this.onCasparRef}
            template={currentTemplate.component}
            data={this.state.data}
            onStateChange={this.onStateChange}
            autoPreview={autoPreview}
          />
        </Screen>
        <div
          style={{
            alignItems: 'stretch',
            flex: '0 0 200px',
            flexDirection: 'row',
            justifyContent: 'space-between',
            display: 'flex',
            paddingTop: 30,
            margin: '0 auto',
            width: screenSize ? screenSize.width : '100%'
          }}
        >
          <div
            style={{
              alignItems: 'center',
              flex: '0 0 50%',
              display: 'grid',
              gridGap: 10,
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridAutoRows: 50,
              paddingRight: 24,
              overflow: 'overlay',
              width: '50%'
            }}
          >
            {templates.map(name => (
              <Link
                key={name}
                to={`/${name}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 30,
                  fontSize: 13,
                  fontWeight: name === currentTemplate.name ? 800 : 300,
                  textTransform: 'uppercase'
                }}
              >
                {name}
              </Link>
            ))}
          </div>
          <div style={{ flex: '0 0 50%', display: 'flex' }}>
            {this.state.cg != null && (
              <Controls
                play={this.state.cg.play}
                pause={this.state.cg.pause}
                stop={this.state.cg.stop}
                update={this.onDataChange}
                data={this.state.data}
                isPlaying={state === States.playing}
                background={this.state.background}
                settings={{ background, autoPreview }}
                onChangeSetting={this.onChangeSetting}
                mode={mode}
                previewDataList={currentTemplate.component.previewDataList}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}
