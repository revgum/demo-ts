az role assignment create \
  --assignee $(az containerapp show \
    --name $CONTAINER_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query identity.principalId -o tsv) \
  --role AcrPull \
  --scope $(az acr show --name $REGISTRY_NAME --query id -o tsv)

az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $REGISTRY_NAME.azurecr.io/$CONTAINER_APP_NAME:latest
