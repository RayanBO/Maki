#!/bin/bash

# Function to display the loading spinner
spinner() {
    local pid=$!
    local delay=0.1
    local spinstr='|/-\'
    echo -n " "
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Log function to display messages with formatting
log() {
    echo "---------------------------------------"
    echo "$1"
}

# Navigate to the soavadi-back server directory
log "Miditra ao @ soavadi-back>server ..."
cd soavadi-back/server || {
    echo "Failed to navigate to soavadi-back/server"
    exit 1
}
log "Ireo dossier ao @ soavadi-back/server :"
ls

# Pull the latest code from the git repository
log "Maka avy any @ git | le version farany ..."
(git pull >/dev/null 2>&1) &
spinner
if [ $? -ne 0 ]; then
    echo "Git pull failed"
    exit 1
else
    log "Git pull completed successfully!"
fi

# Build the project
log "Build serveur..."
(npm run build >/dev/null 2>&1) &
spinner
if [ $? -ne 0 ]; then
    echo "Build failed"
    exit 1
else
    log "Build completed successfully!"
fi

# Restart the server using PM2
log "Restart server Miaraka @ PM2..."
(pm2 restart server >/dev/null 2>&1) &
spinner
if [ $? -ne 0 ]; then
    echo "PM2 restart failed"
    exit 1
else
    log "PM2 restart completed successfully!"
fi

log "Server update completed successfully! 😉"
log " ©️ 2024 | Rayan Rav"
