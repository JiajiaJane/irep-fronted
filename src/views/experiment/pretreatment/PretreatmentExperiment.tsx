import React, { useState, useEffect } from 'react'
import { Button, Select, Input, Checkbox, InputNumber, notification, Spin } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import { Dispatch } from 'redux'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useDispatch } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import styles from './PretreatmentExperiment.module.less'
import { requestFn } from '../../../utils/request'
import WordCloud from '../../../components/wordCloud/WordCloud'
import { setStore } from '../../../utils/util'
import { setLocalStore, getLocalStore } from '../../../utils/util'

const { TextArea } = Input
const { Option } = Select

const PretreatmentExperimentComponent = (props: RouteComponentProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  // 当前的模式，学习或是考核
  const isStudy=getLocalStore('modal')=='0'
  // 判断是否是回退
  var isSaved0=false
  // docId
  var docId0=1
  // originalArticle
  var originalArticle0=''
  // 结合词云简要概述结果
  var analysisText0=''
  // 是否去停用词
  var isRemoveStopWord0=false
  // 分词器
  var analyzerName0='standard'
  // 分词结果
  var segmentResult0='分词结果'
  if(isStudy){
    if(getLocalStore('StudyPretreatment')!=null){
      if(getLocalStore('StudyPretreatment')['docId']!=null){
        docId0=getLocalStore('StudyPretreatment')['docId']
      }
      // 原文档
      if(getLocalStore('StudyPretreatment')['originalArticle']!=null){
        originalArticle0=getLocalStore('StudyPretreatment')['originalArticle']
      }
      // 分词
      if(getLocalStore('StudyPretreatment')['analysisText']!=null){
        analysisText0=getLocalStore('StudyPretreatment')['analysisText']
      }
      // 结果
      if(getLocalStore('StudyPretreatment')['segmentResult']!=null){
        segmentResult0=getLocalStore('StudyPretreatment')['segmentResult']
      }
      // 去停用词
      if(getLocalStore('StudyPretreatment')['isRemoveStopWord']!=null){
        isRemoveStopWord0=getLocalStore('StudyPretreatment')['isRemoveStopWord']
      }
      // 是否是回退
      if(getLocalStore('StudyPretreatment')['isSaved']!=null){
        isSaved0=getLocalStore('StudyPretreatment')['isSaved']
      }
    }
  }else{
    if(getLocalStore('ExamPretreatment')!=null){
      if(getLocalStore('ExamPretreatment')['docId']!=null){
        docId0=getLocalStore('ExamPretreatment')['docId']
      }
      // 原文档
      if(getLocalStore('ExamPretreatment')['originalArticle']!=null){
        originalArticle0=getLocalStore('ExamPretreatment')['originalArticle']
      }
      // 分词
      if(getLocalStore('ExamPretreatment')['analysisText']!=null){
        analysisText0=getLocalStore('ExamPretreatment')['analysisText']
      }
      // 结果
      if(getLocalStore('ExamPretreatment')['segmentResult']!=null){
        segmentResult0=getLocalStore('ExamPretreatment')['segmentResult']
      }
      // 去停用词
       // 结果
      if(getLocalStore('ExamPretreatment')['isRemoveStopWord']!=null){
        isRemoveStopWord0=getLocalStore('ExamPretreatment')['isRemoveStopWord']
      }
      // 是否是回退
      if(getLocalStore('ExamPretreatment')['isSaved']!=null){
        isSaved0=getLocalStore('ExamPretreatment')['isSaved']
      }
    }
  }
  
  // 判断是否已经实验过只是回退
  const [isSaved,setIsSaved]=useState(isSaved0)
  const [docId, setDocId] = useState(docId0)
  const [originalArticle, setOriginalArticle] = useState(originalArticle0)
  const [analyzerName, setAnalyzerName] = useState(analyzerName0)
  const [isRemoveStopWord, setIsRemoveStopWord] = useState(isRemoveStopWord0)
  const [segmentResult, setSegmentResult] = useState(segmentResult0)
  const [analysisText, setAnalysisText] = useState(analysisText0)
  const [getDocLoading, setGetDocLoading] = useState(true)
  const [analyticalContentLoading, setAnalyticalContentLoading] = useState(false)
  const [savedContent, setSavedContent] = useState(false)
  const [preProcessLoading, setPreProcessLoading] = useState(false)
  const [preProcessed, setPreProcessed] = useState(false)
  // 已保存的步骤数，至少发送了预处理请求后，才能下一步，不然后面的实验都走不通
  const [saveStepIndex, setSaveStepIndex] = useState(0)

  useEffect(() => {
    /**
     * 获取指定文档
     */
    const getDoc = async (id: number) => {
      setGetDocLoading(true)
      const res = await requestFn(dispatch, {
        url: '/IRforCN/preProcessing/getDoc',
        method: 'post',
        params: {
          docId: id
        }
      })
      if (res && res.status === 200 && res.data && res.data.content) {
        setOriginalArticle(res.data.content)
        setStore('docId', id)
      } else {
        errorTips('获取文档失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
      }
      setGetDocLoading(false)
    }

    getDoc(docId)

    if (getLocalStore('modal') == 0 && getLocalStore('studyPretreatmentAnswer') != null) {
      setAnalysisText(getLocalStore('studyPretreatmentAnswer'))
    }
    if (getLocalStore('modal') == 1 && getLocalStore('examPretreatmentAnswer') != null) {
      setAnalysisText(getLocalStore('examPretreatmentAnswer'))
    }
  }, [dispatch, docId])

  /**
   * 文档id变化监听
   */
  const DocIdChange = (value: number | undefined) => {
    setDocId(value || 0)
    if(isStudy){
      var localData=getLocalStore('StudyPretreatment')!=null?getLocalStore('StudyPretreatment'):{}
      localData['docId']=value||0
      setLocalStore('StudyPretreatment',localData)
    }else{
      var localData=getLocalStore('ExamPretreatment')!=null?getLocalStore('ExamPretreatment'):{}
      localData['docId']=value||0
      setLocalStore('ExamPretreatment',localData)
    }
  }

  /**
   * 结合词云分析结果简要概述....按钮点击
   */
  const concludeConfirm = async () => {
    setAnalyticalContentLoading(true)
    const res = await requestFn(dispatch, {
      url: '/score/updateAnalyticalContent',
      method: 'post',
      data: {
        experimentId: 2,
        analyticalContent: analysisText
      }
    })
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      successTips('提交成功', '简答题分数已更新')
      setSavedContent(true)
      setSaveStepIndex(saveStepIndex + 1)
      if(isStudy){
        var localData=getLocalStore('StudyPretreatment')!=null?getLocalStore('StudyPretreatment'):{}
        localData['analysisText']=analysisText
        setLocalStore('StudyPretreatment',localData)
      }else{
        var localData=getLocalStore('ExamPretreatment')!=null?getLocalStore('ExamPretreatment'):{}
        localData['analysisText']=analysisText
        setLocalStore('ExamPretreatment',localData)
      }
    } else {
      errorTips('提交失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setAnalyticalContentLoading(false)
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
   * 仿真预处理器时
   *
   * 更新分词器
   */
  const handleChoose = (value: string) => {
    setAnalyzerName(value)
    if(isStudy){
      var localData=getLocalStore('StudyPretreatment')!=null?getLocalStore('StudyPretreatment'):{}
      localData['analyzerName']=value
      setLocalStore('StudyPretreatment',localData)
    }else{
      var localData=getLocalStore('ExamPretreatment')!=null?getLocalStore('ExamPretreatment'):{}
      localData['analyzerName']=value
      setLocalStore('ExamPretreatment',localData)
    }
  }

  /**
   * 仿真预处理器时
   *
   * 更新是否去停用词选项
   */
  const handleChecked = (e: CheckboxChangeEvent) => {
    setIsRemoveStopWord(e.target.checked)
    if(isStudy){
      var localData=getLocalStore('StudyPretreatment')!=null?getLocalStore('StudyPretreatment'):{}
      localData['isRemoveStopWord']=e.target.checked
      setLocalStore('StudyPretreatment',localData)
    }else{
      var localData=getLocalStore('ExamPretreatment')!=null?getLocalStore('ExamPretreatment'):{}
      localData['isRemoveStopWord']=e.target.checked
      setLocalStore('ExamPretreatment',localData)
    }
  }

  /**
   * 构建预处理器，点击分析按钮
   */
  const handelAnalyze = async () => {
    setPreProcessLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/preProcessing/preProcess',
      method: 'post',
      data: {
        token: originalArticle,
        analyzerName: analyzerName,
        isRemoveStopWord: isRemoveStopWord
      }
    })
    if (res && res.status === 200 && res.data) {
      if (res.data.push) {
        setSegmentResult(res.data.join(' '))
        updatePreProcessScore()
        setIsSaved(true)
      }
      if(isStudy){
        var localData=getLocalStore('StudyPretreatment')!=null?getLocalStore('StudyPretreatment'):{}
        localData['segmentResult']=res.data.join(' ')
        setLocalStore('StudyPretreatment',localData)
      }else{
        var localData=getLocalStore('ExamPretreatment')!=null?getLocalStore('ExamPretreatment'):{}
        localData['segmentResult']=res.data.join(' ')
        setLocalStore('ExamPretreatment',localData)
      }
    } else {
      errorTips('分析失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setPreProcessLoading(false)
  }

  /**
   * 保存操作记录--仿真预处理器
   *
   * 用于分数判断
   */
  const updatePreProcessScore = async () => {
    const res = await requestFn(dispatch, {
      url: '/score/createOperationRecord',
      method: 'post',
      data: {
        experimentId: 2,
        operationName: '仿真预处理器'
      }
    })
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      successTips('分析成功', '操作-"仿真预处理器"已保存')
      setSaveStepIndex(saveStepIndex + 1)
      setPreProcessed(true)
    } else {
      errorTips('分析失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  /**
   * 点击底部下一步按钮
   */
  const handleClick = async () => {
    if(isStudy){
      var localData=getLocalStore('StudyPretreatment')!=null?getLocalStore('StudyPretreatment'):{}
      localData['isSaved']=true
      setLocalStore('StudyPretreatment',localData)
    }else{
      var localData=getLocalStore('ExamPretreatment')!=null?getLocalStore('ExamPretreatment'):{}
      localData['isSaved']=true
      setLocalStore('ExamPretreatment',localData)
    }
    const res_1 = await requestFn(dispatch, {
      url: '/score/updateSubScore',
      method: 'post',
      params: {
        experimentId: 2
      }
    })
    if (res_1 && res_1.status === 200 && res_1.data && res_1.data.code === 0) {
      successTips('子实验分数保存成功', '')
      props.history.replace('/experiment/invertedIndex')
    } else {
      errorTips('子实验分数保存失败')
    }
  }

  /**
   * 实时更新用户输入的综合分析文本
   */
  const udpateAnalysisText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnalysisText(event.target.value)
  }

  return (
    <div className={styles.Section}>
      <div className={styles.articleNavBar}>
        <div className={styles.SectionTitle}>原文件</div>
        <div className={styles.articelNumberBox}>
          <label>示例文档：</label>
          <InputNumber min={0} max={165} defaultValue={docId} onChange={DocIdChange} />
        </div>
      </div>
      <Spin spinning={getDocLoading}>
        <div className={styles.originalArticleBox}>{originalArticle}</div>
      </Spin>
      <div className={styles.wordCloudSection}>
        <WordCloud docId={docId} wordCloudId={1}/>
        <WordCloud docId={docId} wordCloudId={2}/>
      </div>
      <div className={styles.concludeSection}>
        <div className={styles.SectionTitle}>请结合词云分析结果简要概述各预处理器处理效果：</div>
        <TextArea rows={6} value={analysisText} onChange={udpateAnalysisText} />
        <div className={styles.ButtonRight}>
          <Button
            loading={analyticalContentLoading}
            disabled={savedContent || analysisText === ''}
            onClick={concludeConfirm}
            type="primary">
            确定
          </Button>
        </div>
      </div>
      <div className={styles.experimentSection}>
        <div className={styles.SectionTitle}>请确认我的预处理器参数：</div>
        <div className={styles.experimentChoose}>
          <div className={styles.segmentChoose}>
            <div className={styles.title}>选择分词器：</div>
            <Select defaultValue="standard" style={{ width: 150 }} onChange={handleChoose}>
              <Option value="standard">标准分词器</Option>
              <Option value="simple">简单分词器</Option>
              <Option value="CJK">二分法分词器</Option>
              <Option value="smartChinese">中文智能分词器</Option>
            </Select>
          </div>
          <Checkbox onChange={handleChecked} checked={isRemoveStopWord}>是否去停用词</Checkbox>
          <Button loading={preProcessLoading} type="primary" disabled={preProcessed} onClick={handelAnalyze}>
            分析
          </Button>
        </div>
        <div className={styles.SectionTitle}>预处理结果：</div>
        <div className={styles.resultBox}>{segmentResult}</div>
        <Button
          className={styles.NextBtn}
          type="primary"
          onClick={handleClick}
          disabled={!isSaved}>
          下一步
        </Button>
      </div>
    </div>
  )
}

/**
 * 预处理实验-构建模型页
 */
const PretreatmentExperiment = withRouter(PretreatmentExperimentComponent)

export default PretreatmentExperiment
