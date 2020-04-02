import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tabs, Button, notification } from 'antd'
import styles from './Pretreatment.module.less'
import Steps from '../../../components/steps/Steps'
import Knowledge from '../../../components/knowledge/Knowledge'
import Examination from '../../../components/examination/Examination'
import { pretreatmentCompletionQuestions, pretreatmentChoiceQuestions } from '../../../config/Constant'
import { pretreatmentKnowledge } from '../../../config/pretreatmentKnowledge'
import PretreatmentExperiment from './PretreatmentExperiment'
import { getUrlParam } from '../../../utils/util'
import { getStore, getLocalStore } from '../../../utils/util'

const { TabPane } = Tabs

const defaultTab = getUrlParam('tab')

/**
 * 预处理实验
 */
const PretreatmentComponet = (props: RouteComponentProps) => {
  const [tabDisabled0,settabDisabled0 ]= useState(getLocalStore('modal') == '0') //学习状态为0
  var isSaved0=false
  if(tabDisabled0){
    if(getLocalStore('StudyPretreatment')!=null){
      if(getLocalStore('Studypretreatment')['isSaved']){
        isSaved0=getLocalStore('Studypretreatment')['isSaved']
      }
    }
  }else{
    if(getLocalStore('ExamPretreatment')!=null){
      if(getLocalStore('ExamPretreatment')['isSaved']){
        isSaved0=getLocalStore('ExamPretreatment')['isSaved']
      }
    }
  }
  const [activeTabKey, setActiveTabKey] = useState(defaultTab || tabDisabled0 ? '1' : '2')
  const [tabDisabled, setTabDisabled] = useState(defaultTab !== '3')
  const [buttonDisabled, setbuttonDisabled] = useState(!getStore('zhuanjia'))
  const [isSaved,setIsSaved]=useState(isSaved0)
  

  /**
   * 知识自查，完成后前往构建模型tab页
   */
  const goNextStep = () => {
    setActiveTabKey('3')
    updateHistory('/experiment/pretreatment?tab=3')
    setTabDisabled(false)
  }

  /**
   * 更新浏览器历史记录
   *
   * 方便刷新页面时保持tab状态
   */
  const updateHistory = (url: string, name = '') => {
    window.history.replaceState(null, name, url)
  }

  /**
   * 点击tab
   */
  const tabClick = (tabIndex: string) => {
    updateHistory(`/experiment/pretreatment?tab=${tabIndex}`)
    setActiveTabKey(tabIndex)
  }

  // 专家进入的可切换前后步骤
  // const able = () => {
  //   if (getStore('zhuanjia')) {
  //     return false
  //   } else {
  //     return tabDisabled
  //   }
  // }

  // 上一步
  const lastStep = () => {
    props.history.replace('/experiment/entry')
  }

   /**提示 */
   const answerTips = (message = '') => {
    notification.success({
      message,
      duration: 2
    })
  }

  const nextStep= () => {
    answerTips('构建倒排索引表之前，应先进行数据预处理，否咋后续实验会出错' )
    props.history.replace('/experiment/invertedIndex')
  }

  const operations = (
    <div>
      <Button className={styles.controlButton} onClick={lastStep}>
        上一步
      </Button>
      <Button className={styles.controlButton} onClick={nextStep} hidden={!tabDisabled0&&!isSaved}>
        下一步
      </Button>
    </div>
  )

  return (
    <div className={styles.Container}>
      <Steps current="构建预处理器" finishedItems={1} />
      <div className={styles.Content}>
        <Tabs
          defaultActiveKey={!tabDisabled0 ? '2' : '1'}
          activeKey={activeTabKey}
          onTabClick={tabClick}
          tabBarExtraContent={operations}>
          <TabPane tab="温故知新" key="1" disabled={!tabDisabled0}>
            <Knowledge knowledge={pretreatmentKnowledge} />
          </TabPane>
          <TabPane tab="知识自查" key="2">
            <Examination
              completionQuestions={pretreatmentCompletionQuestions}
              choiceQuestions={pretreatmentChoiceQuestions}
              experimentId={2}
              goNextStep={goNextStep}
              iStudy={tabDisabled0}
            />
          </TabPane>
          <TabPane tab="构建模型页" key="3">
            <PretreatmentExperiment />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

const Pretreatment = withRouter(PretreatmentComponet)

export default Pretreatment
