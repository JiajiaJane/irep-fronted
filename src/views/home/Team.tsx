import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styles from './Team.module.scss'

const TeamComponet = (props: RouteComponentProps) => {
  const switchRoute = (path: string) => {
    props.history.replace(path)
  }
  return (
    <div className={styles.Container}>
      <h1>支持团队</h1>
      <div className={styles.Content}>
        <button onClick={() => switchRoute('/introduction/background')}>实验背景</button>
        <button onClick={() => switchRoute('/introduction/team')}>支持团队</button>
        <button onClick={() => switchRoute('/introduction/architecture')}>系统架构</button>
      </div>
    </div>
  )
}

const Team = withRouter(TeamComponet)

export default Team
