const uuid = require('uuid/v4');
const chai = require('chai');
chai.should();

const k8sClientFactory = require('../../lib/factories/k8sClient');
const KeyValueK8s = require('../..');

Feature('Update key', () => {
  const k8sClient = k8sClientFactory();
  const key = `test-configmap-${uuid()}`;

  afterEachScenario(async () => {
    await k8sClient.deleteNamespacedConfigMap(key, 'default')
  });

  Scenario('Existing key', () => {
    Given('a configmap named ${key}', async () => {
      const configmap = await k8sClient.createNamespacedConfigMap(
        'default',
        {
          'data': {'message': 'All your base are belong to us!'},
          'metadata': {'name': key},
        },
      )
    });

    When('updating the value of the key', async () => {
      const keyvalueK8s = new KeyValueK8s();
      await keyvalueK8s.updateKey(key, {'answer': '42'});
    });

    Then('the data in the configmap contains the updated value', async () => {
      const updatedConfigmap = await k8sClient.readNamespacedConfigMap(key, 'default')

      updatedConfigmap.body.data.should.deep.equal({'answer': '42'});
    });
  });
});
