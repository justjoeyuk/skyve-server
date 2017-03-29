mkdir doc_src
cp -r ./routes ./doc_src
cp -r ./models ./doc_src
apidoc -i ./doc_src -o apidoc/
rm -rf doc_src
