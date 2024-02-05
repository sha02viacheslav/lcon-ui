WORKING_DIR=$(pwd)
OUTPUT_DIR="${WORKING_DIR}/build/"
cd lcon-rpa-dashboard-ui-prod
npm install --non-interactive
npm run lint:fix
npm run build:prod
{ echo "# Staticfile"; echo "pushstate: enabled"; echo "force_https: true"; } >> ./dist/Staticfile
cp ./manifest.yml ./dist
cp -R ./dist/. "${OUTPUT_DIR}"
cd "${OUTPUT_DIR}" || exit