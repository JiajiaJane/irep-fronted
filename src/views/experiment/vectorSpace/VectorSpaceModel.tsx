import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tabs, Button } from 'antd'
import styles from './VectorSpaceModal.module.less'
import Steps from '../../../components/steps/Steps'
import Knowledge from '../../../components/knowledge/Knowledge'
import Examination from '../../../components/examination/Examination'
import { vectorSpaceCompletionQuestions, vectorSpaceChoiceQuestions } from '../../../config/Constant'
import { vectorSpaceKnowledge } from '../../../config/vectorSpaceKnowledge'
import VectorSpaceExperiment from './VectorSpaceExperiment'
import { getUrlParam, getStore } from '../../../utils/util'
import { getLocalStore } from '../../../utils/util'

const { TabPane } = Tabs

const defaultTab = getUrlParam('tab')

/** 向量空间模型实验 */
const VectorSpaceModalComponet = (props: RouteComponentProps) => {
  const [tabDisabled, setTabDisabled] = useState(defaultTab !== '3')
  const [tabDisabled0, setTabDisabled0] = useState(getLocalStore('modal') == '0')
  const [activeTabKey, setActiveTabKey] = useState(defaultTab || tabDisabled0 ? '1' : '2')

  /** 是否显示操作按钮
   *
   * 仅针对专家账号
   */
  const showButton = () => {
    return !getStore('zhuanjia')
  }

  /** 知识自查，完成后前往构建模型tab页 */
  const goNextStep = () => {
    setActiveTabKey('3')
    updateHistory('/experiment/vectorSpace?tab=3')
    setTabDisabled(false)
  }

  /** 更新浏览器历史记录
   *
   * 方便刷新页面时保持tab状态
   */
  const updateHistory = (url: string, name = '') => {
    window.history.replaceState(null, name, url)
  }

  /** 点击tab */
  const tabClick = (tabIndex: string) => {
    updateHistory(`/experiment/vectorSpace?tab=${tabIndex}`)
    setActiveTabKey(tabIndex)
  }

  /** 专家进入的可切换前后步骤 */
  const able = () => {
    if (getStore('zhuanjia')) {
      return false
    } else {
      return tabDisabled
    }
  }

  /** 上一步 */
  const lastStep = () => {
    props.history.replace('/experiment/boolean')
  }

  /** 下一步 */
  const nextStep = () => {
    props.history.replace('/experiment/probability')
  }

  /** 渲染专家操作按钮组 */
  const renderOperations = (
    <div>
      <Button className={styles.controlButton} onClick={lastStep}>
        上一步
      </Button>
      <Button className={styles.controlButton} onClick={nextStep}>
        下一步
      </Button>
    </div>
  )

  return (
    <div className={styles.Container}>
      <Steps current="构建向量空间模型" finishedItems={5} />
      <div className={styles.Content}>
        <Tabs
          defaultActiveKey={!tabDisabled0 ? '2' : '1'}
          activeKey={activeTabKey}
          onTabClick={tabClick}
          tabBarExtraContent={renderOperations}>
          <TabPane tab="温故知新" key="1" disabled={!tabDisabled0}>
            <Knowledge knowledge={vectorSpaceKnowledge} />
          </TabPane>
          <TabPane tab="知识自查" key="2">
            <Examination
              completionQuestions={vectorSpaceCompletionQuestions}
              choiceQuestions={vectorSpaceChoiceQuestions}
              experimentId={5}
              goNextStep={goNextStep}
              iStudy={tabDisabled0}
            />
          </TabPane>
          <TabPane tab="构建模型页" key="3">
            <VectorSpaceExperiment />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

/** 向量空间模型实验 */
const VectorSpaceModal = withRouter(VectorSpaceModalComponet)

export default VectorSpaceModal
