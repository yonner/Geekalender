2 ECR containers

describe containers

aws ecr describe-images --repository-name geekalender/api --query "imageDetails[].[imageTags[0],imageSizeInBytes,imageManifestMediaType]" --output table
aws ecr describe-images --repository-name geekalender/web --query "imageDetails[].[imageTags[0],imageSizeInBytes,imageManifestMediaType]" --output table

1 role - geekalender-lambda-exec

2 lamda functions (based of the images)

    geekalender-api (with function url)

    geekalender-web (with function url)

