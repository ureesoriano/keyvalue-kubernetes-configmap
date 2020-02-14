const k8sClientFactory = require('./factories/k8sClient');

class KeyValueK8s {
  constructor() {
    this.k8sClient = k8sClientFactory();
  }

  async readKey(key) {
    const configmap = await this.k8sClient.readNamespacedConfigMap(key, 'default')

    return configmap.body.data;
  }
}

module.exports = KeyValueK8s;
