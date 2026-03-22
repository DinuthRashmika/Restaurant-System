package com.example.menu.util;

import java.util.UUID;

public class FileUploadUtil {

    private FileUploadUtil() {
    }

    public static String generateFileName(String originalFilename) {
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        return UUID.randomUUID() + extension;
    }
}