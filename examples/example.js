const KeyValueK8s = require('../index');

(async () => {
  const keyvalueK8s = new KeyValueK8s();
  const keyName = 'keyvalue-k8s-example-configmap'; // name of the example configmap

  let value = await keyvalueK8s.readKey(keyName);
  console.log(value); // original value

  const updatedValue = {'answer': 42};
  await keyvalueK8s.updateKey(keyName, updatedValue);

  value = await keyvalueK8s.readKey(keyName);
  console.log(value); // updated value
})();
