Exec { path => [ "/bin/", "/sbin/" , "/usr/bin/", "/usr/sbin/" ] }

exec { 'add-nodesource-repo':
    command => "curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -",
}

exec { 'add-ubuntu-git-maintainers-repo':
    command => "add-apt-repository ppa:git-core/ppa",
}

class system_update {
    exec { 'apt-get update':
        command => 'apt-get update',
  }
}

class system_upgrade {
    exec { 'apt-get upgrade':
        command => 'apt-get upgrade -y',
    }
}

class system_upgrade {
    exec { 'apt-get install g++':
        command => 'sudo apt-get install -y g++',
    }
}

class install_node {
    package { "nodejs":
        ensure => 'latest',
    }
}

class install_git {
	package { "git":
		ensure => "latest",
	}
}

class install_gulp {
        exec { 'install-grunt':
                command => 'npm install -g gulp',
        }
}

include system_update
include system_upgrade
include install_node
include install_git
include install_gulp