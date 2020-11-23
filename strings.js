// master               main, development, write, primary, conductor, captain
// master branch        main branch, development branch
// master database      write database, primary database, conductor database, captain database
// master DB            write DB, primary DB, conductor DB, captain DB
// master node          write node, primary node, conductor node, captain node
// master instance      write instance, primary instance, conductor instance, captain instance
// multi master         multi writer, multi primary
// slave                replica, secondary, worker, agent, drone, minion
// slave database       replica database, secondary database, worker database, agent database, drone database, minion database
// slave DB             replica db, secondary db, worker db, agent db, drone db, minion db
// slave node           replica node, secondary node, worker node, agent node, drone node, minion node
// slave instance       replica instance, secondary instance, worker instance, agent instance, drone instance, minion instance
// whitelist            allow list
// blacklist            deny list

exports.word_dict = {
    "blacklist": ["deny list"],
    "master": ["main", "development", "write", "primary", "conductor", "captain"],
    "master branch": ["main branch", "development branch"],
    "master DB": ["write DB", "primary DB", "conductor DB", "captain DB"],
    "master database": ["write database", "primary database", "conductor database", "captain database"],
    "master instance": ["write instance", "primary instance", "conductor instance", "captain instance"],
    "master node": ["write node", "primary node", "conductor node", "captain node"],
    "multi-master": ["multi-writer", "multi-primary"],
    "slave": ["replica", "secondary", "worker", "agent", "drone", "minion"],
    "slave DB": ["replica DB", "secondary DB", "worker DB", "agent DB", "drone DB", "minion DB"],
    "slave database": ["replica database", "secondary database", "worker database", "agent database", "drone database", "minion database"],
    "slave instance": ["replica instance", "secondary instance", "worker instance", "agent instance", "drone instance", "minion instance"],
    "slave node": ["replica node", "secondary node", "worker node", "agent node", "drone node", "minion node"],
    "whitelist": ["allow list"],
};

exports.master_dupes = [
    "master branch",
    "master DB",
    "master database",
    "master node",
    "master instance",
    "multi-master",
];

exports.slave_dupes = [
    "slave DB",
    "slave database",
    "slave node",
    "slave instance",
];

