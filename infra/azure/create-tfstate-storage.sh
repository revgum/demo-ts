# The following variables must match what is being used in the terraform configuration block in `main.tf`
RESOURCE_GROUP=terraformstate
# Must be globally unique
STORAGE_ACCOUNT=tfstore008675309
CONTAINER_NAME=tfstate

# Create resources, required only one time during initial setup of this infra repo
az group create --name $RESOURCE_GROUP --location westus2
az storage account create --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --sku Standard_LRS
az storage container create --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT
