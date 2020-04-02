import React, { useCallback, useState } from 'react'
import { Button, Icon, Row, Col, Spin, notification } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import { Dispatch } from 'redux'
import { useDispatch, useMappedState, State, ExperimentCard } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import styles from './InvertedIndexExperiment.module.less'
import { requestFn } from '../../../utils/request'
import { setLocalStore, getLocalStore } from '../../../utils/util'

interface FullIndex {
  id: number
  term: string
  df: number
  indexType: string
  ids: string
}

interface InvertedIndex {
  id: number
  term: string
  docId: number
  tf: number
  indexType: string
  locations: string
}

interface OriginDoc {
  content: string
  docId: number
}



const defaultTerms: FullIndex[] = [
  {
    id: 2384,
    term: '耀',
    df: 16,
    indexType: '1010',
    ids: '121:125:129:112:114:115:142:132:135:165:162:107:108:89:91:98'
  },
  {
    id: 2385,
    term: '怀',
    df: 9,
    indexType: '1010',
    ids: '97:15:52:162:165:158:111:112:103'
  },
  {
    id: 2386,
    term: '退',
    df: 33,
    indexType: '1010',
    ids:
      '106:103:123:121:114:115:112:163:161:160:158:156:157:31:29:42:51:50:48:46:61:55:56:57:58:74:67:85:80:77:78:91:89'
  },
  {
    id: 2387,
    term: '态',
    df: 40,
    indexType: '1010',
    ids:
      '19:11:13:15:60:44:46:47:48:50:51:32:33:37:38:39:40:42:22:24:25:28:31:87:88:92:93:67:131:137:138:122:142:116:112:104:105:103:108:109'
  },
  {
    id: 2388,
    term: '老',
    df: 26,
    indexType: '1010',
    ids: '10:11:13:15:17:18:112:100:106:131:125:126:127:121:158:161:86:65:59:34:37:41:31:0:8:7'
  },
  {
    id: 2389,
    term: '送',
    df: 40,
    indexType: '1010',
    ids:
      '26:46:59:55:65:67:68:90:91:93:89:20:165:162:160:111:119:106:105:102:103:100:108:158:142:143:141:139:135:133:132:130:129:126:127:124:125:120:121:7'
  },
  {
    id: 2390,
    term: '适',
    df: 16,
    indexType: '1010',
    ids: '60:73:89:31:34:165:162:158:156:151:145:142:113:111:104:102'
  },
  {
    id: 2391,
    term: '考',
    df: 49,
    indexType: '1010',
    ids:
      '56:59:41:42:43:44:46:48:50:30:31:32:33:34:35:36:37:38:39:40:20:21:22:23:24:25:26:27:28:29:11:12:13:16:19:86:70:71:5:4:113:112:111:106:136:137:129:121:145'
  },
  {
    id: 2392,
    term: '逃',
    df: 7,
    indexType: '1010',
    ids: '98:131:121:107:106:158:142'
  },
  {
    id: 2393,
    term: '逅',
    df: 2,
    indexType: '1010',
    ids: '158:70'
  }
]

const defaultDocs: InvertedIndex[] = [
  {
    id: 39434,
    term: '耀',
    docId: 121,
    tf: 1,
    indexType: '1010',
    locations: '3090'
  },
  {
    id: 39435,
    term: '耀',
    docId: 125,
    tf: 3,
    indexType: '1010',
    locations: '74:247:287'
  },
  {
    id: 39438,
    term: '耀',
    docId: 129,
    tf: 4,
    indexType: '1010',
    locations: '331:1566:2856:3078'
  },
  {
    id: 39454,
    term: '耀',
    docId: 112,
    tf: 4,
    indexType: '1010',
    locations: '688:709:804:1294'
  },
  {
    id: 39456,
    term: '耀',
    docId: 114,
    tf: 1,
    indexType: '1010',
    locations: '415'
  },
  {
    id: 39457,
    term: '耀',
    docId: 115,
    tf: 1,
    indexType: '1010',
    locations: '814'
  },
  {
    id: 39488,
    term: '耀',
    docId: 142,
    tf: 3,
    indexType: '1010',
    locations: '1079:1164:1167'
  },
  {
    id: 39489,
    term: '耀',
    docId: 132,
    tf: 5,
    indexType: '1010',
    locations: '1023:1025:1029:2259:2266'
  },
  {
    id: 39491,
    term: '耀',
    docId: 135,
    tf: 5,
    indexType: '1010',
    locations: '412:1624:1626:1763:1765'
  },
  {
    id: 39507,
    term: '耀',
    docId: 165,
    tf: 1,
    indexType: '1010',
    locations: '401'
  }
]

const defaultOriginDoc: OriginDoc = {
  content: '',
  docId: 0
}

const defaultInvertedAnswer={
      "1"	:''	,
      "2"	:''	,
      "3"	:	''	,
      "4"	:''	,
      "5"	:	'',
      "6"	: '',
      "7"	:	'',
      "8"	:	''	,
      "9"	:	'',
      "10"	:	''	,
      "11"	:''	,
      "12"	:	''	,
      "13"	:	''	,
      "14"	:	''	,
      "15"	:	''	,
      "16"	:	''	,
      "17"	:	''	,
      "18"	:''	,
      "19"	:	''	,
      "20"	:	''	
}

const InvertedIndexExperimentComponent = (props: RouteComponentProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const state: State = useMappedState(useCallback((globalState: State) => globalState, []))
  // 当前的模式，学习或是考核
  const isStudy=getLocalStore('modal')=='0'
  var isSaved0=false
  var InvertedAnswer=defaultInvertedAnswer
  var  finalFullIndexData=[]
  var OriginDoc0=defaultOriginDoc
  var finalDocs=[]
  // 获取本地已有存储值
  if(isStudy){
    if(getLocalStore('StudyInvertedIndex')!=null){
      if(getLocalStore('StudyInvertedIndex')['InvertedAnswer']!=null){
        InvertedAnswer=getLocalStore('StudyInvertedIndex')['InvertedAnswer']
      }
      // 全部倒排记录表
      if(getLocalStore('StudyInvertedIndex')['finalFullIndexData']!=null){
        finalFullIndexData=getLocalStore('StudyInvertedIndex')['finalFullIndexData']
      }
      // 原文档
      if(getLocalStore('StudyInvertedIndex')['OriginDoc']!=null){
        OriginDoc0=getLocalStore('StudyInvertedIndex')['OriginDoc']
      }
      // 单个词的全部倒排记录表
      if(getLocalStore('StudyInvertedIndex')['finalDocs']!=null){
        finalDocs=getLocalStore('StudyInvertedIndex')['finalDocs']
      }
      // 是否是回退
      if(getLocalStore('StudyInvertedIndex')['isSaved']!=null){
        isSaved0=getLocalStore('StudyInvertedIndex')['isSaved']
      }
    }
  }else{
    if(getLocalStore('ExamInvertedIndex')!=null){
      if(getLocalStore('ExamInvertedIndex')['InvertedAnswer']!=null){
        InvertedAnswer=getLocalStore('ExamInvertedIndex')['InvertedAnswer']
      }
      // 全部倒排记录表
      if(getLocalStore('ExamInvertedIndex')['finalFullIndexData']!=null){
        finalFullIndexData=getLocalStore('ExamInvertedIndex')['finalFullIndexData']
      }
      // 原文档
      if(getLocalStore('ExamInvertedIndex')['OriginDoc']!=null){
        OriginDoc0=getLocalStore('ExamInvertedIndex')['OriginDoc']
      }
      // 单个词的全部倒排记录表
      if(getLocalStore('ExamInvertedIndex')['finalDocs']!=null){
        finalDocs=getLocalStore('ExamInvertedIndex')['finalDocs']
      }
      // 是否回退
      if(getLocalStore('ExamInvertedIndex')['isSaved']!=null){
        isSaved0=getLocalStore('ExamInvertedIndex')['isSaved']
      }
    }
  }
  // 当前选中的词项
  const [currentTerm, setCurrentTerm] = useState<FullIndex>()
  const [isSaved,setIsSaved]=useState(isSaved0)
  // 当前选中词项下面的某一条文档id记录
  const [currentDoc, setCurrentDoc] = useState<InvertedIndex>()
  const [fullIndexLoading, setFullIndexLoading] = useState(false)
  const [invertedIndexLoading, setInvertedIndexLoading] = useState(false)
  const [docLoading, setDocLoading] = useState(false)
  const [saveOrderLoading, setSaveOrderLoading] = useState(false)
  const [terms, setTerms] = useState<FullIndex[]>(finalFullIndexData)
  const [docs, setDocs] = useState<InvertedIndex[]>(finalDocs)
  const [originDoc, setOriginDoc] = useState<OriginDoc>(OriginDoc0)
  const[quiz1,setQuiz1]=useState(InvertedAnswer['1'])
  const[quiz2,setQuiz2]=useState(InvertedAnswer['2'])
  const[quiz3,setQuiz3]=useState(InvertedAnswer['3'])
  const[quiz4,setQuiz4]=useState(InvertedAnswer['4'])
  const[quiz5,setQuiz5]=useState(InvertedAnswer['5'])
  const[quiz6,setQuiz6]=useState(InvertedAnswer['6'])
  const[quiz7,setQuiz7]=useState(InvertedAnswer['7'])
  const[quiz8,setQuiz8]=useState(InvertedAnswer["8"])
  const[quiz9,setQuiz9]=useState(InvertedAnswer["9"])
  const[quiz10,setQuiz10]=useState(InvertedAnswer['10'])
  const[quiz11,setQuiz11]=useState(InvertedAnswer['11'])
  const[quiz12,setQuiz12]=useState(InvertedAnswer['12'])
  const[quiz13,setQuiz13]=useState(InvertedAnswer['13'])
  const[quiz14,setQuiz14]=useState(InvertedAnswer['14'])
  const[quiz15,setQuiz15]=useState(InvertedAnswer['15'])
  const[quiz16,setQuiz16]=useState(InvertedAnswer['16'])
  const[quiz17,setQuiz17]=useState(InvertedAnswer['17'])
  const[quiz18,setQuiz18]=useState(InvertedAnswer['18'])
  const[quiz19,setQuiz19]=useState(InvertedAnswer['19'])
  const[quiz20,setQuiz20]=useState(InvertedAnswer['20'])


  const handleClick = async () => {
    const res_1 = await requestFn(dispatch, {
      url: '/score/updateSubScore',
      method: 'post',
      params: {
        experimentId:3,
      }
    })
    if(res_1 && res_1.status === 200 && res_1.data && res_1.data.code === 0){
      successTips('子实验分数保存成功', '')
      props.history.replace('/experiment/boolean')
    }else{
      errorTips("子实验分数保存失败")
    }
  }

  const shouldRemoveCard = (bool: boolean, name: string, index: number) => {
    if (!bool) {
      return false
    } else {
      removeCard(name, index)
    }
  }

  /**
   * 点击方框移除已放入的卡片
   */
  const removeCard = (name: string, index: number) => {
    dispatch({
      type: 'handle_inverted_card',
      payload: {
        name,
        type: 'remove',
        index
      }
    })
  }

  /**
   * 点击方框放入卡片
   */
  const addCard = (index: number) => {
    const currentIndex = state.invertedIndexCards.findIndex(i => i.current)
    if (currentIndex === -1) {
      return false
    }
    dispatch({
      type: 'handle_inverted_card',
      payload: {
        name: '',
        type: 'add',
        index
      }
    })
  }

  /**
   * 更新倒排索引实验，保存顺序按钮的状态
   */
  const updateSaveOrderBtnStatus = () => {
    dispatch({
      type: 'update_saveOrderBtnStatus',
      payload: {
        field: 'invertedIndex'
      }
    })
  }

  /**
   * 选中卡片
   */
  const selectCard = (name: string, index: number, disabled: boolean) => {
    if (disabled) {
      return false
    }
    dispatch({
      type: 'handle_inverted_card',
      payload: {
        name,
        type: 'selected',
        index
      }
    })
  }

  /**
   * 加载索引成功后才能构建倒排索引
   */
  const canGetFullIndex = () => {
    if (!state.loadindexLoading && state.loadindexSuccess) {
      getFullIndex()
    } else {
      return false
    }
  }

  /**
   * 构建我的倒排索引表
   */
  const getFullIndex = async () => {
    setFullIndexLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/invertedIndex/fullIndex',
      method: 'post'
    })
    if (res && res.status === 200 && res.data) {
      handleFullIndex(res.data)
      setCurrentDoc(undefined)
      setCurrentTerm(undefined)
      setOriginDoc(defaultOriginDoc)
      setIsSaved(true)
      if(isStudy){
        var localData=getLocalStore('StudyInvertedIndex')!=null?getLocalStore('StudyInvertedIndex'):{}
        localData['isSaved']=true
        setLocalStore('StudyInvertedIndex',localData)
      }else{
        var localData=getLocalStore('ExamInvertedIndex')!=null?getLocalStore('ExamInvertedIndex'):{}
        localData['isSaved']=true
        setLocalStore('ExamInvertedIndex',localData)
      }
    } else {
      errorTips('构建我的倒排索引表失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setFullIndexLoading(false)
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
   * 处理接口返回的全部词项的倒排记录表
   *
   * 仅展示前10条记录
   */
  const handleFullIndex = (data: FullIndex[]) => {
    const finalFullIndexData = data.filter((_, index) => index < 10)
    setTerms(finalFullIndexData)
    // 区分考核模式和学习模式
    if(isStudy){
      var localData=getLocalStore('StudyInvertedIndex')!=null?getLocalStore('StudyInvertedIndex'):{}
      localData['finalFullIndexData']=finalFullIndexData
      setLocalStore('StudyInvertedIndex',localData)
    }else{
      var localData=getLocalStore('ExamInvertedIndex')!=null?getLocalStore('ExamInvertedIndex'):{}
      localData['finalFullIndexData']=finalFullIndexData
      setLocalStore('ExamInvertedIndex',localData)
    }
  }

  /**
   * 获取当前词项的全体倒排记录
   */
  const getInvertedIndex = async (item: FullIndex) => {
    setCurrentTerm(item)
    setInvertedIndexLoading(true)
    if(isStudy){
      var localData=getLocalStore('StudyInvertedIndex')!=null?getLocalStore('StudyInvertedIndex'):{}
      localData['CurrentTerm']=item
      setLocalStore('StudyInvertedIndex',localData)
    }else{
      var localData=getLocalStore('ExamInvertedIndex')!=null?getLocalStore('ExamInvertedIndex'):{}
      localData['CurrentTerm']=item
      setLocalStore('ExamInvertedIndex',localData)
    }
    const res = await requestFn(dispatch, {
      url: '/IRforCN/invertedIndex/invertedIndex',
      method: 'post',
      params: {
        term: item.term
      }
    })
    if (res && res.status === 200 && res.data) {
      if(res.data.code==-1){
        errorTips('获取当前词项倒排记录失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
      }else{
        saveOperationStep(res.data)
      }
      
    } else {
      setInvertedIndexLoading(false)
      errorTips('获取当前词项倒排记录失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  /**
   * 保存操作步骤
   */
  const saveOperationStep = async (data: InvertedIndex[]) => {
    const res = await requestFn(dispatch, {
      url: '/score/createOperationRecord',
      method: 'post',
      data: {
        experimentId: 3,
        operationName: '仿真倒排索引表'
      }
    })
    setInvertedIndexLoading(false)
    if (res && res.status === 200 && res.data) {
      handleDocs(data)
      setCurrentDoc(undefined)
      setOriginDoc(defaultOriginDoc)
      successTips('获取当前词项倒排记录成功', '操作-"仿真倒排索引表"已保存')
    } else {
      errorTips('获取当前词项倒排记录失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  /**
   * 获取指定文档的内容
   */
  const getRecordDoc = async (item: InvertedIndex) => {
    setDocLoading(true)
    setCurrentDoc(item)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/preProcessing/getDoc',
      method: 'post',
      params: {
        docId: item.docId
      }
    })
    if (res && res.status === 200 && res.data) {
      setOriginDoc(res.data)
      if(isStudy){
        var localData=getLocalStore('StudyInvertedIndex')!=null?getLocalStore('StudyInvertedIndex'):{}
        localData['OriginDoc']=res.data
        localData['CurrentDoc']=item
        setLocalStore('StudyInvertedIndex',localData)
      }else{
        var localData=getLocalStore('ExamInvertedIndex')!=null?getLocalStore('ExamInvertedIndex'):{}
        localData['OriginDoc']=res.data
        localData['CurrentDoc']=item
        setLocalStore('ExamInvertedIndex',localData)
      }
      
    } else {
      errorTips('获取原文件失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setDocLoading(false)
  }

  /**
   * 处理接口返回的单个词项的所有倒排记录数据
   *
   * 仅展示前10条记录
   */
  const handleDocs = (data: InvertedIndex[]) => {
    const finalDocs = data.filter((_, index) => index < 10)
    setDocs(finalDocs)
    if(isStudy){
      var localData=getLocalStore('StudyInvertedIndex')!=null?getLocalStore('StudyInvertedIndex'):{}
      localData['finalDocs']=finalDocs
      setLocalStore('StudyInvertedIndex',localData)
    }else{
      var localData=getLocalStore('ExamInvertedIndex')!=null?getLocalStore('ExamInvertedIndex'):{}
      localData['finalDocs']=finalDocs
      setLocalStore('ExamInvertedIndex',localData)
    }
   
  }

  /**
   * 获取用户排序的索引
   */
  const getStepIndex = (_: { name: string }[], cards: ExperimentCard[]) => {
    const newCards = cards.map(i => i)
    newCards.sort((pre, cur) => pre.index - cur.index)
    return newCards.map(i => i.correctIndex + 1)
  }

  /**
   * 保存卡片顺序
   */
  const saveOrderRequest = async () => {
    setSaveOrderLoading(true)
    const res = await requestFn(dispatch, {
      url: '/score/updateRankingScore',
      method: 'post',
      data: {
        experimentId: 3,
        rankingResult: getStepIndex(state.invertedSteps, state.invertedIndexCards)
      }
    })
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      successTips('保存顺序成功', '')
      updateSaveOrderBtnStatus()
    } else {
      errorTips('保存顺序失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setSaveOrderLoading(false)
  }

  /**
   * 渲染卡片列表
   */
  const renderCards = () => {
    return state.invertedIndexCards.map((i, index) => {
      return (
        <div
          key={index}
          className={`${styles.Card} ${i.disabled ? styles.CardDisabled : i.current ? styles.CurrentCard : ''}`}
          onClick={() => selectCard(i.name, index, i.disabled)}>
          {i.name}
        </div>
      )
    })
  }

  /**
   * 渲染方框中的卡片
   */
  const renderCard = (name: string, index: number) => {
    if (name) {
      return (
        <div
          className={`${styles.Name}`}
          onClick={() => shouldRemoveCard(!state.saveOrderBtn.invertedIndex.saved, name, index)}>
          <span>{`${index + 1}.${name}`}</span>
          <div className={styles.IconWrapper}>
            <Icon type="close-circle" className={styles.Icon} />
          </div>
        </div>
      )
    } else {
      return (
        <span className={styles.Index} onClick={() => addCard(index)}>
          {index + 1}
        </span>
      )
    }
  }

  /**
   * 渲染当前选中的卡片
   */
  const renderCurrentCard = () => {
    const currentCards = state.invertedIndexCards.filter(i => i.current)
    if (currentCards.length > 0) {
      return (
        <div className={styles.CurrentCardTips}>
          <span>当前选中卡片: </span>
          <span className={styles.CurrentCardName}>{currentCards[0].name}</span>
        </div>
      )
    }
  }

  // 传回倒排索引小练习的用户答案
  const quizhandleClick=async ()=>{
    const data= {
      "1"	:quiz1	,
      "2"	:	quiz2	,
      "3"	:	quiz3	,
      "4"	:	quiz4	,
      "5"	:	quiz5,
      "6"	: quiz6,
      "7"	:	quiz7,
      "8"	:	quiz8	,
      "9"	:	quiz9	,
      "10"	:	quiz10	,
      "11"	:	quiz11	,
      "12"	:	quiz12	,
      "13"	:	quiz13	,
      "14"	:	quiz14	,
      "15"	:	quiz15	,
      "16"	:	quiz16	,
      "17"	:	quiz17	,
      "18"	:	quiz18	,
      "19"	:	quiz19	,
      "20"	:	quiz20	
    }
    console.log(data)
    const res = await requestFn(dispatch, {
      url: '/score/updateInvertedScore',
      method: 'post',
      data:data
    })
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      successTips('提交成功', '')
      if(isStudy){
        var localData=getLocalStore('StudyInvertedIndex')!=null?getLocalStore('StudyInvertedIndex'):{}
        localData['InvertedAnswer']=data
        setLocalStore('StudyInvertedIndex',localData)
      }else{
        var localData=getLocalStore('ExamInvertedIndex')!=null?getLocalStore('ExamInvertedIndex'):{}
        console.log(localData)
        localData['InvertedAnswer']=data
        setLocalStore('ExamInvertedIndex',localData)
      } 
    } else {
      errorTips('提交失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  // 更新倒排索引题答案
  const Quiz1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz1(event.target.value)
  }
  const Quiz2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz2(event.target.value)
  }
  const Quiz3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz3(event.target.value)
  }
  const Quiz4 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz4(event.target.value)
  }
  const Quiz5 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz5(event.target.value)
  }
  const Quiz6 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz6(event.target.value)
  }
  const Quiz7 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz7(event.target.value)
  }
  const Quiz8 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz8(event.target.value)
  }
  const Quiz9 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz9(event.target.value)
  }
  const Quiz10 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz10(event.target.value)
  }
  const Quiz11 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz11(event.target.value)
  }
  const Quiz12 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz12(event.target.value)
  }
  const Quiz13 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz13(event.target.value)
  }
  const Quiz14 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz14(event.target.value)
  }
  const Quiz15 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz15(event.target.value)
  }
  const Quiz16 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz16(event.target.value)
  }
  const Quiz17 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz17(event.target.value)
  }
  const Quiz18 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz18(event.target.value)
  }
  const Quiz19 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz19(event.target.value)
  }
  const Quiz20 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz20(event.target.value)
  }

  /**
   * 渲染倒排索引词典表格题目
   */
  const renderInvertedIndexForm = () => {
    return (
      <div className={styles.InvertedIndexForm}>
        <p className={styles.FormTips}>以如下几篇文档为例，完成下方词典表格和schizophrenia的倒排记录</p>
        <ul className={styles.List}>
          <li>文档0 breakthough drug for schizophrenia</li>
          <li>文档1 new schizophrenia drug</li>
          <li>文档2 new hopes for schizophrenia patients</li>
        </ul>
        <Row className={styles.TitleRow}>
          <Col span={4} className={styles.FormTitle}>
            词项
          </Col>
          <Col span={4} className={styles.FormTitle}>
            文档频率
          </Col>
          <Col span={4} className={styles.FormTitle}>
            全体倒排记录表
          </Col>
          <Col span={4} className={styles.FormTitle}>
            文档ID
          </Col>
          <Col span={4} className={styles.FormTitle}>
            词频频率
          </Col>
          <Col span={4} className={styles.FormTitle}>
            位置索引
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.FormItem}>
            breakthough
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz1} onChange={(e)=>Quiz1(e)} />
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz2} onChange={(e)=>Quiz2(e)} />
          </Col>
          <Col span={4} className={styles.FormItem}>
            0
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz15} onChange={(e)=>Quiz15(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz16} onChange={(e)=>Quiz16(e)}/>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.FormItem}>
            drug
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz3} onChange={(e)=>Quiz3(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz4} onChange={(e)=>Quiz4(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            1
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz17} onChange={(e)=>Quiz17(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz18} onChange={(e)=>Quiz18(e)}/>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.FormItem}>
            for
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz5} onChange={(e)=>Quiz5(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz6} onChange={(e)=>Quiz6(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            2
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz19} onChange={(e)=>Quiz19(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz20} onChange={(e)=>Quiz20(e)}/>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.FormItem}>
            schizophrenia
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz7} onChange={(e)=>Quiz7(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz8} onChange={(e)=>Quiz8(e)}/>
          </Col>
          <Col span={12} className={styles.TableName}>
            b.倒排记录表
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.FormItem}>
            new
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz9} onChange={(e)=>Quiz9(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz10} onChange={(e)=>Quiz10(e)}/>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.FormItem}>
            hopes
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz11} onChange={(e)=>Quiz11(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz12} onChange={(e)=>Quiz12(e)}/>
          </Col>
        </Row>
        <Row>
          <Col span={4} className={styles.FormItem}>
            patients
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz13} onChange={(e)=>Quiz13(e)}/>
          </Col>
          <Col span={4} className={styles.FormItem}>
            <input value={quiz14} onChange={(e)=>Quiz14(e)}/>
          </Col>
        </Row>
        <Row>
          <Col span={12} className={`${styles.TableName} ${styles.FirstTableName}`}>
            a.词典
          </Col>
        </Row>
        <div className={styles.ConfirmBtn}>
          <Button type="primary" onClick={quizhandleClick}>确认</Button>
        </div>
      </div>
    )
  }

  /**
   * 渲染倒排索引表内容
   */
  const renderTbody = () => {
    if (terms.length > 0) {
      return terms.map(i => {
        return (
          <tr
            key={i.id}
            className={currentTerm && currentTerm.id === i.id ? styles.Active : ''}
            onClick={() => getInvertedIndex(i)}>
            <td className={styles.TermTd}>{i.term}</td>
            <td>{i.df}</td>
            <td className={styles.CollipsisTd}>{i.ids}</td>
          </tr>
        )
      })
    } else {
      return defaultTerms.map(i => {
        return (
          <tr key={i.id}>
            <td></td>
            <td></td>
            <td className={styles.CollipsisTd}></td>
          </tr>
        )
      })
    }
  }

  /**
   * 渲染单个词项的全体倒排记录表
   */
  const renderTermRecordTbody = () => {
    if (docs.length > 0) {
      return docs.map(i => {
        return (
          <tr
            key={i.id}
            className={currentDoc && currentDoc.id === i.id ? styles.Active : ''}
            onClick={() => getRecordDoc(i)}>
            <td>{i.docId}</td>
            <td>{i.tf}</td>
            <td className={styles.CollipsisTd}>{i.locations}</td>
          </tr>
        )
      })
    } else {
      return defaultDocs.map(i => {
        return (
          <tr key={i.id}>
            <td></td>
            <td></td>
            <td className={styles.CollipsisTd}></td>
          </tr>
        )
      })
    }
  }

  return (
    <div>
      <div className={styles.Section}>
        <div className={styles.SectionTitle}>请正确构建倒排索引表架构:</div>
        <div className={styles.TopBoxWrapper}>
          <div className={styles.TopBox}>
            <div className={styles.BoxLeft}>
              <div
                className={`${styles.BoxLeftTop} ${styles.BoxItem} ${
                  state.saveOrderBtn.invertedIndex.saved ? styles.BoxItemDisabled : ''
                }`}>
                {renderCard(state.invertedSteps[0].name, 0)}
              </div>
              <div className={styles.BoxLeftBottom}>
                <div
                  className={`${styles.BoxItem} ${
                    state.saveOrderBtn.invertedIndex.saved ? styles.BoxItemDisabled : ''
                  }`}>
                  {renderCard(state.invertedSteps[3].name, 3)}
                </div>
                <div
                  className={`${styles.BoxItem} ${
                    state.saveOrderBtn.invertedIndex.saved ? styles.BoxItemDisabled : ''
                  }`}>
                  {renderCard(state.invertedSteps[4].name, 4)}
                </div>
              </div>
            </div>
            <div
              className={`${styles.BoxMiddle} ${styles.BoxItem} ${
                state.saveOrderBtn.invertedIndex.saved ? styles.BoxItemDisabled : ''
              }`}>
              {renderCard(state.invertedSteps[1].name, 1)}
            </div>
            <div className={styles.BoxRight}>
              <div
                className={`${styles.BoxRightTop} ${styles.BoxItem} ${
                  state.saveOrderBtn.invertedIndex.saved ? styles.BoxItemDisabled : ''
                }`}>
                {renderCard(state.invertedSteps[2].name, 2)}
              </div>
              <div className={styles.BoxRightBottom}>
                <div
                  className={`${styles.BoxItem} ${
                    state.saveOrderBtn.invertedIndex.saved ? styles.BoxItemDisabled : ''
                  }`}>
                  {renderCard(state.invertedSteps[5].name, 5)}
                </div>
                <div
                  className={`${styles.BoxItem} ${
                    state.saveOrderBtn.invertedIndex.saved ? styles.BoxItemDisabled : ''
                  }`}>
                  {renderCard(state.invertedSteps[6].name, 6)}
                </div>
                <div
                  className={`${styles.BoxItem} ${
                    state.saveOrderBtn.invertedIndex.saved ? styles.BoxItemDisabled : ''
                  }`}>
                  {renderCard(state.invertedSteps[7].name, 7)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.BoxTips}>
          <span>点击下方卡片选中，再点击上面的方框，填入正确的架构。</span>
          {renderCurrentCard()}
        </div>
        <div className={styles.BoxWrapper}>{renderCards()}</div>
        <div className={styles.SaveOrderBtn}>
          <Button
            type="primary"
            loading={saveOrderLoading}
            disabled={!state.saveOrderBtn.invertedIndex.completed || state.saveOrderBtn.invertedIndex.saved}
            onClick={saveOrderRequest}>
            保存
          </Button>
        </div>
      </div>
      <div className={styles.Section}>
        <div className={styles.SectionTitle}>构建倒排索引表Demo:</div>
        {renderInvertedIndexForm()}
      </div>
      <div className={styles.Section}>
        <div
          className={`${styles.RunBtn} ${state.loadindexLoading ? styles.RunBtnDisabled : ''}`}
          onClick={canGetFullIndex}>
          构建我的倒排索引表
        </div>
        <div className={styles.TableGroup}>
          <div className={styles.Spin}>
            <Spin spinning={fullIndexLoading}>
              <table className={styles.Table}>
                <colgroup>
                  <col width={85} />
                  <col width={85} />
                  <col width={239} />
                </colgroup>
                <thead>
                  <tr>
                    <th colSpan={2} className={styles.ThColorBlue}>
                      词典
                    </th>
                    <th rowSpan={2} colSpan={3} className={styles.ThColorBlue}>
                      全体倒排记录
                    </th>
                  </tr>
                  <tr>
                    <th className={styles.ThColorBlue}>词项</th>
                    <th className={styles.ThColorBlue}>文档频率</th>
                  </tr>
                </thead>
                <tbody>{renderTbody()}</tbody>
              </table>
            </Spin>
          </div>
          <div className={styles.Spin}>
            <Spin spinning={invertedIndexLoading}>
              <table className={`${styles.Table} ${styles.TableDetail}`}>
                <colgroup>
                  <col width={85} />
                  <col width={85} />
                  <col width={239} />
                </colgroup>
                <thead>
                  <tr>
                    <th colSpan={3} className={styles.ThColorGreen}>
                      全体倒排记录表
                    </th>
                  </tr>
                  <tr>
                    <th className={styles.ThColorGreen}>文档ID</th>
                    <th className={styles.ThColorGreen}>词项频率</th>
                    <th className={styles.ThColorGreen}>位置索引</th>
                  </tr>
                </thead>
                <tbody>{renderTermRecordTbody()}</tbody>
              </table>
            </Spin>
          </div>
        </div>
      </div>
      <div className={styles.Section}>
        <div className={styles.SectionTitle}>原文件:</div>
        <Spin spinning={docLoading}>
          <div className={styles.OriginDoc}>{originDoc.content}</div>
        </Spin>
      </div>
      <Button className={styles.NextStep} type="primary" onClick={handleClick} disabled={!isSaved}>
        下一步
      </Button>
    </div>
  )
}

/**
 * 倒排索引--构建模型页
 */
const InvertedIndexExperiment = withRouter(InvertedIndexExperimentComponent)

export default InvertedIndexExperiment
