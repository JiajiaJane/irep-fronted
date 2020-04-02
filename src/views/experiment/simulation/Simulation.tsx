import React, { useState } from 'react'
import { Dispatch } from 'redux'
import { Input, notification, Button, Spin } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import styles from './Simulation.module.less'
import Steps from '../../../components/steps/Steps'
import { requestFn } from '../../../utils/request'
import { useDispatch } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import { SearchResult } from '../../../modal/Search'
import { setStore, getStore, getLocalStore, removeLocalStore } from '../../../utils/util'
import SearchImg from '../../../assets/simulation/search.png'

const { Search } = Input

/**
 * 仿真我的搜索引擎
 */
const SimulationComponent = (props: RouteComponentProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const [showResult, setShowResult] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [finishLoading, setFinishLoading] = useState(false)
  const [query, setQuery] = useState('')
  const isStudy=getLocalStore('modal')=='0'

  /** 点击完成，保存实验相关信息 */
  const saveScore = async () => {
    setFinishLoading(true)
    // 更新用户总成绩
    const res_2 = await requestFn(dispatch, {
      url: '/score/updateUserScore',
      method: 'post',
    })
    if(res_2&& res_2.status === 200 && res_2.data && res_2.data.code === 0){
      successTips('总成绩保存成功', '')
      if(getStore("source")=="0"){
        setStore('finishedAllExperiments', 'yes')
        // 清空本地记录
        if(!isStudy){
          removeLocalStore('ExamPretreatment')
          removeLocalStore('ExamInvertedIndex')
          removeLocalStore('ExamBoolean')
          removeLocalStore('ExamLanguage')
          removeLocalStore('ExamVectorSpace')
          removeLocalStore('ExamProbability')
          removeLocalStore('ExamEvaluation')
          removeLocalStore('modal')
          for(var i=1;i<8;i++){
            removeLocalStore('examAnswer'+i)
          }
        }
        props.history.replace('/report')
      }
      else if(getStore("source")=="1"){
        // // 获取总成绩？需要与后台讨论
        // const res_1 = await requestFn(dispatch, {
        //   url: '/report/getReport',
        //   method: 'get'
        // })
        // console.log(res_1)
        // if (res_1 && res_1.status === 200&& res_1.data.code!=-1) {
        //   var score=res_1.data.score
        //   alert(score)
        // } else {
        //   score=50
        // }
        const res = await requestFn(dispatch, {
          url: '/platform/sendData',
          method: 'post',
          data: {
            username: getStore('user').id,
            projectTitle: '网络大数据搜索引擎虚拟仿真实验',
            childProjectTitle: '网络大数据搜索引擎虚拟仿真实验',
            status: 1,
            score:0,
            startDate: getStore('startDate') || new Date().getTime() - 15 * 60 * 1000,
            endDate: new Date().getTime(),
            timeUsed: handleEndDate(getStore('startDate') || new Date().getTime() - 15 * 60 * 1000, new Date().getTime()),
            issuerId: '',
            attachmentId: ''
          }
        })
        setFinishLoading(false)
        if (res && res.status === 200 && res.data && res.data.code === 0) {
          setStore('finishedAllExperiments', 'yes')
          if(!isStudy){
            removeLocalStore('ExamPretreatment')
            removeLocalStore('ExamInvertedIndex')
            removeLocalStore('ExamBoolean')
            removeLocalStore('ExamLanguage')
            removeLocalStore('ExamVectorSpace')
            removeLocalStore('ExamProbability')
            removeLocalStore('ExamEvaluation')
            removeLocalStore('modal')
            for(var i=1;i<8;i++){
              removeLocalStore('examAnswer'+i)
            }
          }
          props.history.replace('/report')
        } else {
          errorTips('操作失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
        }
      }
    }else{
      errorTips("总成绩保存失败")
    }
  }

  /** 处理实验结束时间 */
  const handleEndDate = (start: number, end: number) => {
    return parseInt((end - start) / 1000 / 60 + '')
  }

  /** 是否显示按钮，仅针对专家 */
  // const showButton = () => {
  //   return !getStore('zhuanjia')
  // }

  // 返回上一步
  const lastStep = () => {
    props.history.replace('/experiment/evaluation')
  }

  /**
   * 搜索
   */
  const search = async (value: string) => {
    setLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/Simulation/search',
      method: 'post',
      params: {
        query: value
      }
    })
    if (res && res.status === 200 && res.data && !res.data.msg) {
      setQuery(value)
      if (res.data.push) {
        const newResults = res.data.filter((_: SearchResult, index: number) => index < 5)
        setResults(newResults)
        setShowResult(true)
      }
    } else {
      errorTips('检索失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setLoading(false)
  }

  /**
   * 成功提示
   */
  const successTips = (message = '', description = '') => {
    notification.success({
      message,
      duration: 1.5,
      description
    })
  }

  /**
   * 错误提示
   */
  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
  }

  /**
   * 点击搜索按钮
   */
  const handleSearch = async (value: string) => {
    search(value)
  }

  /**
   * 渲染搜索结果
   */
  const renderResult = () => {
    if (results.length > 0 || loading) {
      return results.map((i, index) => {
        return (
          <div key={index} className={styles.Result}>
            <a className={styles.resultTitle} href={i.url} target="_black" rel="noopener noreferrer">
              {i.title}
            </a>
            <div className={styles.resultContent}>{i.content}</div>
          </div>
        )
      })
    } else {
      return <div className={styles.EmptyResult}>找不到搜索结果</div>
    }
  }

  return (
    <div className={styles.Container}>
      <Steps current="仿真我的搜索引擎" finishedItems={9} />
      <div className={styles.Content}>
        <div className={styles.MiddleSection} hidden={showResult}>
          <img className={styles.logo} src={SearchImg} alt="icon"></img>
          <span className={styles.SectionTitle}>
            {getStore('user') ? getStore('user').username : '郭晨睿'}的搜索引擎
          </span>
          <Search
            className={styles.InputSection}
            placeholder="输入检索式"
            enterButton="搜索"
            size="large"
            onSearch={handleSearch}
          />
        </div>
        <div hidden={!showResult}>
          <div className={styles.topSection}>
            <img className={styles.logo} src={SearchImg} alt="icon"></img>
            <div className={styles.topTitle}>{getStore('user') ? getStore('user').username : '郭晨睿'}的搜索引擎</div>
            <Search
              className={styles.InputSection}
              placeholder="输入检索式"
              enterButton="搜索"
              size="large"
              defaultValue={query}
              onSearch={handleSearch}
            />
          </div>
          <div className={styles.ResultSection}>
            <Spin spinning={loading}>{renderResult()}</Spin>
          </div>
        </div>
        <Button
          type="primary"
          loading={finishLoading}
          hidden={!showResult}
          onClick={saveScore}
          className={styles.NextBtn}>
          完成
        </Button>
        <Button className={styles.lastStep} onClick={lastStep}>
          上一步
        </Button>
      </div>
    </div>
  )
}

const Simulation = withRouter(SimulationComponent)

export default Simulation
