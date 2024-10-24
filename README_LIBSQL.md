# Bottomless S3-compatible virtual WAL for libSQL
This project implements a virtual write-ahead log (WAL) which continuously backs up the data to S3-compatible storage and is able to restore it later.

## Configuration
By default, the S3 storage is expected to be available at `http://localhost:9000` (e.g. a local development [minio](https://min.io) server), and the auth information is extracted via regular S3 SDK mechanisms, i.e. environment variables and `~/.aws/credentials` file, if present. Ref: https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/guide_credentials_environment.html

Default endpoint can be overridden by an environment variable too, and in the future it will be available directly from libSQL as an URI parameter:
```
export LIBSQL_BOTTOMLESS_ENDPOINT='http://localhost:9042'
export LIBSQL_BOTTOMLESS_BUCKET='custom-bucket'
```

On top of that, bottomless is implemented on top of the official [Rust SDK for S3](https://crates.io/crates/aws-sdk-s3), so all AWS-specific environment variables like `AWS_DEFAULT_REGION`, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` also work, as well as the `~/.aws/credentials` file.

## CLI
The command-line interface supports browsing, restoring and removing snapshot generations.
It can be installed as a standalone executable with:
```sh
RUSTFLAGS="--cfg uuid_unstable" cargo install bottomless-cli
```
Alternatively, bottomless-cli is available from the repository by running `cargo run`.

### Examples

For this setup, login the docker container and use `bottomless-cli -n ns-:default` which will autodetect load all ENV variables automatically.

#### Restoring the database
```
$ RUST_LOG=info bottomless-cli -e http://localhost:9000 restore
2022-12-23T10:16:10.703557Z  INFO bottomless::replicator: Bucket bottomless exists and is accessible
2022-12-23T10:16:10.709526Z  INFO bottomless_cli: Database: test.db
2022-12-23T10:16:10.713070Z  INFO bottomless::replicator: Restoring from generation e4eb3c29-fe84-7347-a0c0-b9a3a71d0fc2
2022-12-23T10:16:10.727646Z  INFO bottomless::replicator: Restored the main database file
```

#### Removing old snapshots
```
$ bottomless-cli -e http://localhost:9000 rm -v --older-than 2022-12-15
Removed 4 generations
```

## Details
All page writes committed to the database end up being asynchronously replicated to S3-compatible storage.
On boot, if the main database file is empty, it will be restored with data coming from the remote storage.
If the database file is newer, it will be uploaded to the remote location with a new generation number.
If a local WAL file is present and detected to be newer than remote data, it will be uploaded as well.