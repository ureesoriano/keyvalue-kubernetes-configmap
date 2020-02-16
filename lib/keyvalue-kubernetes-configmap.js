const k8sClientFactory = require('./factories/k8sClient');

class KeyValueK8s {
  constructor() {
    this.k8sClient = k8sClientFactory();
  }

  async readKey(key) {
    const configmap = await this.k8sClient.readNamespacedConfigMap(key, 'default')

    return configmap.body.data;
  }

  async updateKey(key, value) {
    await this.k8sClient.replaceNamespacedConfigMap(
      key,
      'default',
      {
        'data': value,
        'metadata': {'name': key},
      },
    );
  }
}

module.exports = KeyValueK8s;
