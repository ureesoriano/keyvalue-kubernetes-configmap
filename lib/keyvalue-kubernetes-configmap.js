const k8sClientFactory = require('./factories/k8sClient');

class KeyValueK8s {
  constructor(k8sClient) {
    this.k8sClient = k8sClient || k8sClientFactory();
  }

  async createKey(key, value) {
    let configmap;

    try {
      configmap = await this.k8sClient.createNamespacedConfigMap(
        'default',
        {
          'data': {'value': JSON.stringify(value) },
          'metadata': {'name': key},
        },
      );
    } catch(e) {
      if (e.response && e.response.body.code === 409) {
        throw Error(`Key '${key}' already exists`);
      } else {
        throw e;
      }
    }

    return configmap.body.data.value
      ? JSON.parse(configmap.body.data.value)
      : configmap.body.data;
  }

  async readKey(key) {
    let configmap;

    try {
      configmap = await this.k8sClient.readNamespacedConfigMap(key, 'default')
    } catch(e) {
      if (e.response && e.response.body.code === 404) {
        throw Error(`Key '${key}' not found`);
      } else {
        throw e;
      }
    }

    return configmap.body.data.value
      ? JSON.parse(configmap.body.data.value)
      : configmap.body.data;
  }

  async updateKey(key, value) {
    try {
      await this.k8sClient.replaceNamespacedConfigMap(
        key,
        'default',
        {
          'data': {'value': JSON.stringify(value) },
          'metadata': {'name': key},
        },
      );
    } catch (e) {
      if (e.response.body.code === 404) {
        throw Error(`Key '${key}' not found`);
      } else {
        throw e;
      }
    }
  }

  async deleteKey(key) {
    try {
      await this.k8sClient.deleteNamespacedConfigMap(key, 'default')
    } catch(e) {
      if (e.response && e.response.body.code === 404) {
        throw Error(`Key '${key}' not found`);
      } else {
        throw e;
      }
    }
  }
}

module.exports = KeyValueK8s;
