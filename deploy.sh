#!/bin/bash
cd build
aws s3 sync . s3://tools.monday.health --delete
