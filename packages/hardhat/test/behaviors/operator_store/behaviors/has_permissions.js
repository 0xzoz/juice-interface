const { expect } = require("chai");

const tests = {
  success: [
    {
      it: "has permissions, account is sender",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42, 41, 255]
        },
        check: {
          sender: deployer,
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42, 41]
        },
        result: true
      })
    },
    {
      it: "has permissions, account is not sender",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [7, 8, 9]
        },
        check: {
          sender: addrs[1],
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [7]
        },
        result: true
      })
    },
    {
      it: "doesnt have permissions, never set",
      fn: ({ deployer, addrs }) => ({
        check: {
          sender: deployer,
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42]
        },
        result: false
      })
    },
    {
      it: "doesnt have permission, all indexes differ",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [1, 2, 3]
        },
        check: {
          sender: deployer,
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42]
        },
        result: false
      })
    },
    {
      it: "doesnt have permission, some indexes differ",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [1, 2, 3]
        },
        check: {
          sender: deployer,
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [1, 42]
        },
        result: false
      })
    },
    {
      it: "doesnt have permissions, projectId differs",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42]
        },
        check: {
          sender: deployer,
          account: deployer,
          projectId: 0,
          operator: addrs[0],
          permissionIndexes: [42]
        },
        result: false
      })
    }
  ],
  failure: [
    {
      it: "index out of bounds",
      fn: ({ deployer, addrs }) => ({
        check: {
          sender: deployer,
          account: deployer,
          projectId: 0,
          operator: addrs[0],
          permissionIndexes: [256]
        },
        revert: "OperatorStore::hasPermissions: INDEX_OUT_OF_BOUNDS"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.it, async function() {
        const { set, check, result } = successTest.fn(this);
        if (set) {
          await this.contract
            .connect(set.sender)
            .setOperator(
              set.projectId,
              set.operator.address,
              set.permissionIndexes
            );
        }
        const flag = await this.contract
          .connect(check.sender)
          .hasPermissions(
            check.account.address,
            check.projectId,
            check.operator.address,
            check.permissionIndexes
          );
        expect(flag).to.equal(result);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.it, async function() {
        const { check, revert } = failureTest.fn(this);
        await expect(
          this.contract
            .connect(check.sender)
            .hasPermissions(
              check.account.address,
              check.projectId,
              check.operator.address,
              check.permissionIndexes
            )
        ).to.be.revertedWith(revert);
      });
    });
  });
};