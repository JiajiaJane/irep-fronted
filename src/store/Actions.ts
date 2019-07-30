/**
 * redux中actions的类型
 */
export type Actions =
  | {
      type: 'fetch_begin'
      payload: {
        pageLoading: boolean
      }
    }
  | {
      type: 'fetch_success'
      payload: {
        pageLoading: boolean
      }
    }
  | {
      type: 'fetch_failed'
      payload: {
        pageLoading: boolean
      }
    }
  | {
      type: 'handle_entry_card'
      payload: {
        name: string
        type: 'add' | 'selected' | 'remove'
        index: number
      }
    }
  | {
      type: 'handle_inverted_card'
      payload: {
        name: string
        type: 'add' | 'selected' | 'remove'
        index: number
      }
    }
  | {
      type: 'update_loadindex'
      payload: {
        loadindexLoading: true | false
        loadindexSuccess?: true | false
      }
    }
