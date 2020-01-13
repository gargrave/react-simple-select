import * as React from 'react'

import { styles } from '../../Select.helpers'

export const Loader: React.FC = React.memo(() => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}>
        <div className={styles.loaderItem} />
        <div className={styles.loaderItem} />
        <div className={styles.loaderItem} />
        <div className={styles.loaderItem} />
      </div>
    </div>
  )
})
