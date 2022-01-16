import { Button, Modal } from 'antd'
import { ProjectContext } from 'contexts/projectContext'
import { BigNumber } from 'ethers'
import { useAddToBalanceTx } from 'hooks/transactor/AddToBalanceTx'
import { useMigrateV1ProjectTx } from 'hooks/transactor/MigrateV1ProjectTx'
import { useContext, useState } from 'react'
import { getTerminalAddress } from 'utils/terminal-versions'

export default function MigrateV1Pt1Modal({
  visible,
  onCancel,
}: {
  visible: boolean
  onCancel: VoidFunction
}) {
  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()
  const [loadingMigrate, setLoadingMigrate] = useState<boolean>()
  const { balance, handle } = useContext(ProjectContext)
  const migrateV1ProjectTx = useMigrateV1ProjectTx()
  const addToBalanceTx = useAddToBalanceTx()

  const needsBalance = balance?.eq(0)

  function migrate() {
    const newTerminalAddress = getTerminalAddress('1.1')

    if (!newTerminalAddress) return

    setLoadingMigrate(true)

    migrateV1ProjectTx(
      { newTerminalAddress },
      {
        onDone: () => {
          setLoadingMigrate(false)
          onCancel()
        },
      },
    )
  }

  function add1Wei() {
    setLoadingAddToBalance(true)

    addToBalanceTx(
      { value: BigNumber.from(1) },
      {
        onDone: () => setLoadingAddToBalance(false),
      },
    )
  }

  return (
    <Modal
      visible={visible}
      onOk={migrate}
      onCancel={onCancel}
      okText="Migrate to V1.1"
      okType="primary"
      confirmLoading={loadingMigrate}
      okButtonProps={{ disabled: needsBalance }}
    >
      <h2>Migrate to Juicebox V1.1</h2>
      <p>
        This project is currently using the Juicebox V1 terminal contract. New
        features introduced in V1.1 allow the project owner to:
      </p>
      <ul>
        <li>Pause received payments</li>
        <li>Burn project tokens</li>
        <li>Mint project tokens on demand</li>
      </ul>
      <p>
        <a
          href="https://juicebox.notion.site/Migration-plan-1a05f62d80284cb1b8df2a3b53da341a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation on v1.1 contracts
        </a>
      </p>

      {needsBalance && (
        <div>
          <p>
            <b>NOTE:</b> This project has a balance of 0. Projects cannot be
            migrated without a balance. To migrate this project, first pay it or
            use the button below to deposit 1 wei (0.000000000000000001 ETH).
          </p>
          <p>
            <Button block onClick={add1Wei} loading={loadingAddToBalance}>
              Deposit 1 wei to @{handle}
            </Button>
          </p>
        </div>
      )}
    </Modal>
  )
}
