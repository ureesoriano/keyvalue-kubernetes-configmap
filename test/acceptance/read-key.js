const uuid = require('uuid/v4');
const chai = require('chai');
chai.should();

const k8sClientFactory = require('../../lib/factories/k8sClient');
const KeyValueK8s = require('../..');

Feature('Read key', () => {
  const k8sClient = k8sClientFactory();
  const key = `test-configmap-${uuid()}`;

  afterEachScenario(async () => {
    await k8sClient.deleteNamespacedConfigMap(key, 'default')
  });

  Scenario('Existing key', () => {
    let value;

    Given('a configmap named ${key}', async() => {
      const configmap = await k8sClient.createNamespacedConfigMap(
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
  });
});
