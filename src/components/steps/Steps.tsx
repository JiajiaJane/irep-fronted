import React from 'react'
import styles from './Steps.module.scss'
import checkedImg from '../../assets/steps/checked.png'
import unChekedImg from '../../assets/steps/unchecked.png'

const steps = [
  {
    name: '构建我的索引器',
    finished: true,
    current: false
  },
  {
    name: '构建预处理器',
    finished: true,
    current: false
  },
  {
    name: '构建倒排索引表',
    finished: true,
    current: false
  },
  {
    name: '构建我的检索器',
    finished: true,
    current: false
  },
  {
    name: '构建布尔模型',
    finished: true,
    current: false
  },
  {
    name: '构建向量空间模型',
    finished: false,
    current: true
  },
  {
    name: '构建概率检索模型',
    finished: false,
    current: false
  },
  {
    name: '构建语言模型',
    finished: false,
    current: false
  },
  {
    name: '分析检索模型性能',
    finished: false,
    current: false
  },
  {
    name: '仿真我的搜索引擎',
    finished: false,
    current: false
  }
]

const Steps = () => {
  const renderSteps = () => {
    return steps.map(i => {
      return (
        <div key={i.name} className={`${styles.Item} ${i.finished ? styles.Finished : ''}`}>
          <span className={`${styles.Name} ${i.finished ? styles.FinishedName : ''}`}>{i.name}</span>
          <img src={i.finished ? checkedImg : unChekedImg} alt="" className={styles.Status} />
        </div>
      )
    })
  }

  return <div className={styles.Container}>{renderSteps()}</div>
}

export default Steps
