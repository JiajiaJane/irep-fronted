import React, { useState, useEffect } from 'react'
import { Form, Button, Select, Checkbox, notification, Spin } from 'antd'
import { Dispatch } from 'redux'
import { FormComponentProps } from 'antd/lib/form/Form'
import ReactWordCloud from 'react-wordcloud'
import { useDispatch } from '../../store/Store'
import { Actions } from '../../store/Actions'
import styles from './WordCloud.module.less'
import { requestFn } from '../../utils/request'
import { getLocalStore, setLocalStore } from '../../utils/util'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

/**
 * 词云组件接口
 */
interface WordCloudProps extends FormComponentProps {
  docId: number
  readonly wordCloudId?:number
}

interface Term {
  term: string
  tf: number
}

interface Word {
  text: string
  value: number
}

const { Option } = Select

const WordCloudComponent = (props: WordCloudProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const isStudy=getLocalStore('modal')=='0'
  var analyzerName0='standard'
  var isRemoveStopWord0=false
  if(isStudy){
    if(getLocalStore('StudyPretreatment')!=null){
      if(getLocalStore('StudyPretreatment')['wordcloudfieldValue'+props.wordCloudId]!=null){
        analyzerName0=getLocalStore('StudyPretreatment')['wordcloudfieldValue'+props.wordCloudId]['analyzerName']
        isRemoveStopWord0=getLocalStore('StudyPretreatment')['wordcloudfieldValue'+props.wordCloudId]['isRemoveStopWord']
      }
       // 放弃存储词云图，时间代价太大
      // if(getLocalStore('StudyPretreatment')['wordClouds'+props.wordCloudId]!=null){
      //   wordclouds0=getLocalStore('StudyPretreatment')['wordClouds'+props.wordCloudId]
      // }
    }
  }else{
    if(getLocalStore('ExamPretreatment')!=null){
      if(getLocalStore('ExamPretreatment')['wordcloudfieldValue'+props.wordCloudId]!=null){
        analyzerName0=getLocalStore('ExamPretreatment')['wordcloudfieldValue'+props.wordCloudId]['analyzerName']
        isRemoveStopWord0=getLocalStore('ExamPretreatment')['wordcloudfieldValue'+props.wordCloudId]['isRemoveStopWord']
      }
      // 放弃存储词云图，时间代价太大
      // if(getLocalStore('ExamPretreatment')['wordClouds'+props.wordCloudId]!=null){
      //   wordclouds0=getLocalStore('ExamPretreatment')['wordClouds'+props.wordCloudId]
      // }
    }
  }

  const [analyzerName, setAnalyzerName] = useState(analyzerName0)
  const [isRemoveStopWord, setIsRemoveStopWord] = useState(isRemoveStopWord0)
  const [wordCloudLoading, setWordCloudLoading] = useState(false)
  const [wordClouds, setWordClouds] = useState<Word[]>([])
  const { getFieldDecorator, validateFields, getFieldsValue} = props.form
  

  
  useEffect(() => {
    /**
     * 获取词云数据
     */
    const getWordCloud = async (id: number, name: string, bool: boolean) => {
      const res = await requestFn(dispatch, {
        url: '/IRforCN/preProcessing/createTermCloud',
        method: 'post',
        params: {
          docId: id,
          analyzerName: name,
          isRemoveStopWord: bool
        }
      })
      if (res && res.status === 200 && res.data && res.data) {
        setWordClouds(handleTerms(res.data.data))
        // 放弃存储词云图，时间代价大
        // if(isStudy){
        //   var localData=getLocalStore('StudyPretreatment')!=null?getLocalStore('StudyPretreatment'):{}
        //   localData['wordClouds'+props.wordCloudId]=handleTerms(res.data.data)
        //   setLocalStore('StudyPretreatment',localData)
        // }else{
        //   var localData=getLocalStore('ExamPretreatment')!=null?getLocalStore('ExamPretreatment'):{}
        //   localData['wordClouds'+props.wordCloudId]=handleTerms(res.data.data)
        //   setLocalStore('ExamPretreatment',localData)
        // }
        updateScore()
      } else {
        errorTips('获取词云分析失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
      }
      setWordCloudLoading(false)
    }

    /**
     * 更新(保存)获取词云操作
     *
     * 用于评估分数
     */
    const updateScore = async () => {
      const res = await requestFn(dispatch, {
        url: '/score/createOperationRecord',
        method: 'post',
        data: {
          experimentId: 2,
          operationName: '词云分析'
        }
      })
      // console.log(res)
      if (res && res.status === 200 && res.data && res.data.code === 0) {
        successTips('分析成功', '操作-"词云分析"已保存')
      } else {
        errorTips('获取词云分析失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
      }
    }

    if (wordCloudLoading) {
      getWordCloud(props.docId, analyzerName, isRemoveStopWord)
    }
  }, [dispatch, props.docId, analyzerName, isRemoveStopWord, wordCloudLoading])

  /**
   * 处理接口返回的词云数据
   */
  const handleTerms = (data: Term[]) => {
    return data.map(i => {
      return {
        text: i.term,
        value: i.tf
      }
    })
  }

  /**
   * 点击分析按钮
   */
  const handleAnalyze = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateFields((err: any) => {
      if (!err) {
        const fieldValue = getFieldsValue(['analyzerName', 'isRemoveStopWord'])
        if(isStudy){
          var localData=getLocalStore('StudyPretreatment')!=null?getLocalStore('StudyPretreatment'):{}
          localData['wordcloudfieldValue'+props.wordCloudId]=fieldValue
          setLocalStore('StudyPretreatment',localData)
        }else{
          var localData=getLocalStore('ExamPretreatment')!=null?getLocalStore('ExamPretreatment'):{}
          localData['wordcloudfieldValue'+props.wordCloudId]=fieldValue
          setLocalStore('ExamPretreatment',localData)
        }
        setAnalyzerName(fieldValue.analyzerName)
        setIsRemoveStopWord(fieldValue.isRemoveStopWord)
        setWordCloudLoading(true)
      }
    })
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
   * 渲染词云模块
   */
  const renderWordColud = () => {
    if (wordClouds.length === 0) {
      return <div className={styles.Tips}>词云图生成需要时间，请点击分析按钮，生成词云</div>
    } else {
      return (
        <ReactWordCloud
          words={wordClouds}
          options={{
            colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
            enableTooltip: true,
            deterministic: true,
            fontFamily: 'impact',
            fontSizes: [5, 60],
            fontStyle: 'normal',
            fontWeight: 'normal',
            padding: 1,
            rotations: 3,
            rotationAngles: [0, 90],
            // scale: 'sqrt',
            spiral: 'archimedean',
            transitionDuration: 1000
          }}
        />
      )
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

  return (
    <div className={styles.wordSection}>
      <div className={styles.wordCloudSectionTitle}>词云分析</div>
      <div className={styles.wordCloudBox}>
        <Spin spinning={wordCloudLoading}>
          <div className={styles.Box}>{renderWordColud()}</div>
        </Spin>
      </div>
      <div className={styles.wordCloudChoose}>
        <div className={styles.FormGroup}>
          <Form.Item className={styles.Select}>
            {getFieldDecorator('analyzerName', {
              initialValue: analyzerName
            })(
              <Select style={{ width: 150 }}>
                <Option value="standard">标准分词器</Option>
                <Option value="simple">简单分词器</Option>
                <Option value="CJK">二分法分词器</Option>
                <Option value="smartChinese">中文智能分词器</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('isRemoveStopWord', {
              initialValue: isRemoveStopWord
            })(<Checkbox onChange={handleChecked} checked={isRemoveStopWord}>去停用词</Checkbox>)}
          </Form.Item>
        </div>
        <Button className={styles.button} type="primary" loading={wordCloudLoading} onClick={handleAnalyze}>
          分析
        </Button>
      </div>
    </div>
  )
}

const WordCloud = Form.create<WordCloudProps>({ name: 'WordCloudProps' })(WordCloudComponent)

export default WordCloud
