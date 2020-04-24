const uuid = require('uuid/v4');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

const k8sClientFactory = require('../../lib/factories/k8sClient');
const KeyValueK8s = require('../..');


Feature('Delete key', () => {
  Scenario('Existing key', () => {
    const k8sClient = k8sClientFactory();
    const key = `test-configmap-${uuid()}`;
    let value;

    Given('a configmap named ${key}', async() => {
      await k8sClient.createNamespacedConfigMap(
        'default',
        {
          'data': {'message': 'All your base are belong to us!'},
          'metadata': {'name': key},
        },
      )
    });

    When('deleting the key', async () => {
      const keyvalueK8s = new KeyValueK8s();
      await keyvalueK8s.deleteKey(key);
    });

    Then('the configmap no longer exists', async () => {
      k8sClient.readNamespacedConfigMap(key, 'default').should.eventually.throw();
    });
  });

  Scenario('Non-existent key', () => {
    let nonexistantKey;

    Given('a non-existant configmap', () => {
      nonexistantKey = `nonexistant-${uuid()}`;
    });

    When('attempting to delete the key', () => {});

    Then('a "not found" exception is raised', async () => {
      const keyvalueK8s = new KeyValueK8s();
      keyvalueK8s.readKey(nonexistantKey).should.eventually.throw(/not found/);
    });
  });
});
