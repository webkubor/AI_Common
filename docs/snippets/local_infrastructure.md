# Local Infrastructure Config

## Vector Database (Milvus)
- **Type**: Milvus Lite (Global Native / No Docker)
- **Installation**: `pipx install "milvus[server]"`
- **Command**: `milvus-server`
- **Data Path**: `~/.milvus/data`
- **Port**: `19531` (TCP)
- **Log**: `~/.milvus/milvus.log`
- **Startup Script**: `nohup milvus-server --data ~/.milvus/data > ~/.milvus/milvus.log 2>&1 &`
- **Status**: Active (Listening on 127.0.0.1:19531)
- **UI**: None (Attu requires Docker). Use Python/Node SDK to verify.