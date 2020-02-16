const uuid = require('uuid/v4');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

const k8sClientFactory = require('../../lib/factories/k8sClient');
const KeyValueK8s = require('../..');


Feature('Read key', () => {
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

    When('reading the value of the key', async () => {
      const keyvalueK8s = new KeyValueK8s();
      value = await keyvalueK8s.readKey(key);
    });

    Then('a value is returned', () => {
      value.should.exist;
    });

    And('the value contains the data in the configmap', () => {
      value.should.deep.equal({'message': 'All your base are belong to us!'});
    });

    after( async () => {
      await k8sClient.deleteNamespacedConfigMap(key, 'default')
    });
  });

  Scenario('Non-existent key', () => {
    let nonexistantKey;

    Given('a non-existant configmap', () => {
      nonexistantKey = `nonexistant-${uuid()}`;
    });

    When('attempting to read the value of the key', () => {});

    Then('a "not found" exception is raised', async () => {
      const keyvalueK8s = new KeyValueK8s();
      keyvalueK8s.readKey(nonexistantKey).should.eventually.throw(/not found/);
    });
  });
});
