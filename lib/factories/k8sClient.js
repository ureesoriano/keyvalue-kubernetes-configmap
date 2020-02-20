const k8s = require('@kubernetes/client-node');

module.exports = (path_to_kubeconfig) => {
  const kubeconfig = new k8s.KubeConfig();

  if (path_to_kubeconfig || process.env.KUBECONFIG) {
    kubeconfig.loadFromFile(path_to_kubeconfig || process.env.KUBECONFIG);
  }
  else {
    kubeconfig.loadFromCluster();
  }
  const k8sClient = kubeconfig.makeApiClient(k8s.CoreV1Api);

  return k8sClient;
};
