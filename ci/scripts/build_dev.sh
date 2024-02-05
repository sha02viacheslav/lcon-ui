WORKING_DIR=$(pwd)
OUTPUT_DIR="${WORKING_DIR}/build/"
cd lcon-rpa-dashboard-ui-dev
npm install --non-interactive
npm run lint:fix
npm run build
cp ./manifest.yml ./dist
{ echo "# Staticfile"; echo "pushstate: enabled"; echo "force_https: true"; } >> ./dist/Staticfile
cp -R ./dist/. "${OUTPUT_DIR}"
cd "${OUTPUT_DIR}" || exit