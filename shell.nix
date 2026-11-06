{ pkgs ? import <nixpkgs> { } }:
#   pg-start / pg-stop
pkgs.mkShell {
  packages = [
    pkgs.nodejs
    pkgs.postgresql_17
  ];

  shellHook = ''
    export PGDATA="$PWD/.pgdata"
    export PGHOST="$PWD/.pgdata/sock"
    export PGPORT=5432

    if [ ! -d "$PGDATA" ]; then
      initdb --auth=trust --username=postgres >/dev/null
      mkdir -p "$PGHOST"
      echo "unix_socket_directories = '$PGHOST'" >> "$PGDATA/postgresql.conf"
      echo "listen_addresses = 'localhost'" >> "$PGDATA/postgresql.conf"
    fi

    pg-start() { pg_ctl -D "$PGDATA" -l "$PGDATA/server.log" start; }
    pg-stop()  { pg_ctl -D "$PGDATA" stop; }
    pg-init-db() { createdb -U postgres roblox_dashboard; }
    echo "Postgres ready. Run: pg-start, then pg-init-db (first time only)"
  '';
}
