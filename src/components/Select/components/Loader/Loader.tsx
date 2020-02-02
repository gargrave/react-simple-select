import * as React from 'react'

import { styles } from '../../Select.helpers'
import { TestIdElementsList } from '../../Select.types'

export type LoaderProps = {
  testIds?: Pick<TestIdElementsList, 'loaderWrapper' | 'loader'>
}

export const Loader: React.FC<LoaderProps> = React.memo(({ testIds = {} }) => {
  return (
    <div className={styles.loaderWrapper} data-testid={testIds.loaderWrapper}>
      <div className={styles.loader} data-testid={testIds.loader}>
        <div className={styles.loaderItem} />
        <div className={styles.loaderItem} />
        <div className={styles.loaderItem} />
        <div className={styles.loaderItem} />
      </div>
    </div>
  )
})
