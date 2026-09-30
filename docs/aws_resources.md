2 ECR containers

describe containers

aws ecr describe-images --repository-name geekalender/api --query "imageDetails[].[imageTags[0],imageSizeInBytes,imageManifestMediaType]" --output table
aws ecr describe-images --repository-name geekalender/web --query "imageDetails[].[imageTags[0],imageSizeInBytes,imageManifestMediaType]" --output table

TODO: configure an ECR lifetime policy so we only keep the last few images instead of all

1 role - geekalender-lambda-exec

2 lamda functions (based of the images)

    geekalender-api (with function url)

    geekalender-web (with function url)

