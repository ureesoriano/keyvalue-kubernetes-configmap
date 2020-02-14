const k8s = require('@kubernetes/client-node');

module.exports = (path_to_kubeconfig) => {
  const kubeconfig = new k8s.KubeConfig();
  kubeconfig.loadFromFile(path_to_kubeconfig || process.env.KUBECONFIG);
  const k8sClient = kubeconfig.makeApiClient(k8s.CoreV1Api);

  return k8sClient;
};
