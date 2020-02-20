const uuid = require('uuid/v4');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

const k8sClientFactory = require('../../lib/factories/k8sClient');
const KeyValueK8s = require('../..');


Feature('Update key', () => {
  Scenario('Existing key', () => {
    const k8sClient = k8sClientFactory();
    const key = `test-configmap-${uuid()}`;

    Given('a configmap named ${key}', async () => {
      await k8sClient.createNamespacedConfigMap(
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

      updatedConfigmap.body.data.should.deep.equal({'value': JSON.stringify({'answer': '42'})});
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

    When('attempting to update the value of the key', () => {});

    Then('a "not found" exception is raised', async () => {
      const keyvalueK8s = new KeyValueK8s();
      keyvalueK8s.updateKey(nonexistantKey, {'a': '42'}).should.eventually.throw(/not found/);
    });
  });
});
