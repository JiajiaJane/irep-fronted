/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react'
import { Dispatch } from 'redux'
import { Table, notification } from 'antd'
import styles from './Report.module.less'
import { getStore } from '../../utils/util'
import { requestFn } from '../../utils/request'
import { useDispatch } from '../../store/Store'
import { Actions } from '../../store/Actions'

type columnAlignType = 'center' | 'left' | 'right' | undefined
const columnAlignCenter: columnAlignType = 'left'

const Report= () => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const [report, setReport] = useState()
  const date = new Date()
  const time = date.toLocaleString()
  var name = getStore('user').username
  var number = getStore('user').jobNumber
  const studentClass = ''
  const [score,setScore]=useState(" ")
  const [experiment1,setExperiment1]=useState()
  const [experiment2,setExperiment2]=useState()
  const [experiment3,setExperiment3]=useState()
  const [experiment4,setExperiment4]=useState()
  const [experiment5,setExperiment5]=useState()
  const [score1,setScore1]=useState("0")
  const [score2,setScore2]=useState("0")
  const [score3,setScore3]=useState("0")
  const [score4,setScore4]=useState("0")
  const [score5,setScore5]=useState("0")


  useEffect(() => {
    /** 获取实验报告 */
    const getReport = async () => {
      const res = await requestFn(dispatch, {
        url: '/report/getReport',
        method: 'get'
      })
      // console.log(res)
      if (res && res.status === 200) {
        if(res.data==null){
          alert("暂无实验报告，请前往'我的实验'")
        }else{
          name = res.data.userName
          number=res.data.jobNumber
          const report=res.data
          setReport(report)
          setScore(report.score)
          setExperiment1(report.experiment1.records)
          setExperiment2(report.experiment2.records)
          setExperiment3(report.experiment3.records)
          setExperiment4(report.experiment4.records)
          setExperiment5(report.experiment5.records)
          setScore1(report.experiment1.score)
          setScore2(report.experiment2.score)
          setScore3(report.experiment3.score)
          setScore4(report.experiment4.score)
          setScore5(report.experiment5.score)      
        }
      } else {
        errorTips('获取实验报告失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
      }
    }
    getReport()
  }, [dispatch])

  /** 错误提示 */
  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
  }


  const columns = [
    {
      title: '项目',
      dataIndex: 'item',
      width: '300px',
      align: columnAlignCenter
    },
    {
      title: '结果',
      dataIndex: 'result',
      width: '300px',
      align: columnAlignCenter
    },
    {
      title: '得分',
      dataIndex: 'score',
      width: '200px',
      align: columnAlignCenter
    }
  ]

  const data1=experiment1
  const data2=experiment2
  const data3=experiment3
  const data4=experiment4
  const data5=experiment5
 

  return (
    <div className={styles.Container}>
      <div className={styles.topContainer}>
        <div className={styles.topTitle}>实验报告</div>
        <div className={styles.subTitle}>Experiment Report</div>
      </div>
      <div className={styles.Content}>
        <div className={styles.Report}>
          <h1 className={styles.ReportTitle}>武汉大学《网络大数据搜索引擎设计虚拟仿真实验》实验报告</h1>
          <div className={styles.reporTop}>
            <div>
              姓名：<input className={styles.topInput} value={name} disabled></input>
            </div>
            <div>
              学号：<input className={styles.topInput} value={number} disabled></input>
            </div>
            <div>
              班级：<input className={styles.topInput} value={studentClass} disabled></input>
            </div>
            <div>
              评分：<input className={styles.topInput} value={score} disabled></input>
            </div>
          </div>
          <div className={styles.reporTop2}>
            <div>
              实验名称：<input className={styles.topInput2} value="网络大数据搜索引擎设计虚拟仿真实验" disabled></input>
            </div>
            <div>
              实验日期：<input className={styles.topInput3} value={time} disabled></input>
            </div>
          </div>
          <h2>实验结果与分析：</h2>
          <Table
            columns={columns}
            dataSource={data1}
            bordered
            size="middle"
            title={() => '子实验1   信息检索模型架构：'+" "+score1+"分"}
            pagination={false}
          />
          ,
          <Table
            columns={columns}
            dataSource={data2}
            bordered
            size="middle"
            title={() => '子实验2   构建搜索引擎索引器：'+" "+score2+"分"}
            pagination={false}
          />
          ,
          <Table
            columns={columns}
            dataSource={data3}
            bordered
            size="middle"
            title={() => '子实验3   构建搜索引擎检索器：'+" "+score3+"分"}
            pagination={false}
          />
          ,
          <Table
            columns={columns}
            dataSource={data4}
            bordered
            size="middle"
            title={() => '子实验4   分析检索模型性能：'+" "+score4+"分"}
            pagination={false}
          />
          ,
          <Table
            columns={columns}
            dataSource={data5}
            bordered
            size="middle"
            title={() => '子实验5   仿真搜索引擎：'+" "+score5+"分"}
            pagination={false}
          />
          ,
        </div>
      </div>
    </div>
  )
}

export default Report
