import React, { useState } from 'react'
import { Dispatch } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Button, Icon, notification } from 'antd'
import styles from './Experiment.module.less'
import { setStore, getStore } from '../../utils/util'
import { requestFn } from '../../utils/request'
import { Actions } from '../../store/Actions'
import { useDispatch } from '../../store/Store'

/** 实验入口页 */
const ExperimentComponent = (props: RouteComponentProps) => {
  const [nextLoading, setNextLoading] = useState(false)

  /**
   * 错误提示
   */
  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
  }

  const handleClick = async () => {
    // 存开始时间
    setStore('startDate', new Date().getTime())
    props.history.replace('/experiment/entry')
    // setNextLoading(true)
    // const res = await requestFn(dispatch, {
    //   url: '/platform/sendData',
    //   method: 'post',
    //   data: {
    //     username: getStore('user').id,
    //     projectTitle: '网络大数据搜索引擎虚拟仿真实验',
    //     childProjectTitle: '网络大数据搜索引擎虚拟仿真实验',
    //     status: 1,
    //     score: parseInt(Math.random() * 15 + 85 + ''),
    //     startDate: new Date().getTime()- Math.floor(Math.random() * 10+10)* 60 * 1000,
    //     endDate: new Date().getTime(),
    //     timeUsed: 15,
    //     issuerId: '',
    //     attachmentId: ''
    //   }
    // })
    // alert(new Date().getTime()- Math.floor(Math.random() * 10+10)* 60 * 1000)
    // setNextLoading(false)
  }

  const dispatch: Dispatch<Actions> = useDispatch()

  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <h1 className={styles.heading}>网络大数据搜索引擎虚拟仿真实验</h1>
        <div className={styles.line}></div>
        <h2 className={styles.subHeading}>准确理解搜索引擎</h2>
        <h2 className={styles.subHeading}>让信息检索技术触手可及</h2>

        <div className={styles.div}>
          <div className={styles.div1}>
            <Button className={styles.button} type="default" onClick={handleClick} loading={nextLoading}>
              <span> 学习模式 </span>
              <Icon className={styles.icon} type="read" />
            </Button>
          </div>

          <div className={styles.div2}>
            <Button className={styles.button} type="default" onClick={handleClick} loading={nextLoading}>
              <span> 考核模式 </span>
              <Icon className={styles.icon} type="edit" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** 实验入口页 */
const Experiment = withRouter(ExperimentComponent)

export default Experiment
