import io
import os
from urllib.request import urlopen
from datetime import timedelta

from minio import Minio
from minio.tagging import Tags

from minio.commonconfig import REPLACE, CopySource
from minio.deleteobjects import DeleteObject

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
STORAGE_DIR = os.path.join(BASE_DIR, 'storage')

client = Minio(
    "localhost:9000",
    access_key="admin",
    secret_key="adminadmin",
    secure=False
)

# client.make_bucket("my-bucket", "us-west-1")

buckets = client.list_buckets()
for bucket in buckets:
    print(f'*** {bucket.name} ***')
    # print(client.get_bucket_policy(bucket.name))
    tags = Tags.new_bucket_tags()
    tags["Project"] = "Project One"
    tags["User"] = "jsmith"
    client.set_bucket_tags(bucket.name, tags)

    for obj in client.list_objects(bucket.name, recursive=True):
        print(f'{obj.object_name} : {obj.size} bytes')

        # try:
        #     response = client.get_object(bucket.name, obj.object_name)
        #     print(response)
        #     # Read data from response.
        # finally:
        #     response.close()
        #     response.release_conn()

        client.fget_object(bucket.name, obj.object_name, os.path.join(STORAGE_DIR, obj.object_name))
    # client.remove_bucket(bucket.name)

# result = client.copy_object(
#     "photos",
#     "Makefile.copy",
#     CopySource("my-bucket", "Makefile"),
# )
# print(result.object_name, result.version_id)


data = b'hello'
result = client.put_object(
    "my-bucket", "hello.txt", io.BytesIO(data), len(data),
)
print(
    "created {0} object; etag: {1}, version-id: {2}".format(
        result.object_name, result.etag, result.version_id,
    ),
)

# data = urlopen(
#     "https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.4.81.tar.xz",
# )
# result = client.put_object(
#     "my-bucket", "kernel", data, length=-1, part_size=10*1024*1024,
# )
# print(
#     "created {0} object; etag: {1}, version-id: {2}".format(
#         result.object_name, result.etag, result.version_id,
#     ),
# )

    # delete_object_list = map(
    #     lambda x: DeleteObject(x.object_name),
    #     client.list_objects(bucket.name, recursive=True),
    # )
    # errors = client.remove_objects(bucket.name, delete_object_list)
    # for error in errors:
    #     print("error occurred when deleting object", error)

url = client.get_presigned_url(
    "GET",
    "my-bucket",
    "hello.txt",
    expires=timedelta(hours=2),
)
print(url)

url = client.get_presigned_url(
    "DELETE",
    "my-bucket",
    "hello.txt",
    expires=timedelta(hours=2),
)
print(url)