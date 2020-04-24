const uuid = require('uuid/v4');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

const k8sClientFactory = require('../../lib/factories/k8sClient');
const KeyValueK8s = require('../..');


Feature('Create key', () => {
  Scenario('Already existing key', () => {
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

    When('creating a key with the same name', () => {});

    Then('a "key already exists" exception is raised', async () => {
      const keyvalueK8s = new KeyValueK8s();
      keyvalueK8s.createKey(key, {'a': '42'}).should.eventually.throw(/already exists/);
    });

    after( async () => {
      await k8sClient.deleteNamespacedConfigMap(key, 'default')
    });
  });

  Scenario('Non-existent key', () => {
    const k8sClient = k8sClientFactory();
    let key;

    Given('a non-existant configmap', async () => {
      key = `nonexistant-${uuid()}`;
      k8sClient.readNamespacedConfigMap(key, 'default').should.eventually.throw();
    });

    When('creating the key', async () => {
      const keyvalueK8s = new KeyValueK8s();
      await keyvalueK8s.createKey(key, {'answer': '42'});
    });

    Then('a configmap named ${key} exists in the cluster', async () => {
      k8sClient.readNamespacedConfigMap(key, 'default').should.eventually.not.throw();
    });

    after( async () => {
      await k8sClient.deleteNamespacedConfigMap(key, 'default')
    });
  });
});
